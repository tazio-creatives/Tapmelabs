/**
 * Lead Scoring Service — Claude Haiku Batch API + Prompt Caching
 * Scores pending leads in batches every hour.
 * Cost: ~₹0.04 per lead using Batch API + prompt cache
 */

const Anthropic = require("@anthropic-ai/sdk");
const { Lead, User } = require("../models");
const { Op } = require("sequelize");

const BATCH_SIZE   = 100;   // max leads per batch
const POLL_DELAY   = 5000;  // ms between batch status polls
const MAX_POLLS    = 60;    // max ~5 min wait (60 × 5s)
const LEADS_LIMIT  = 500;   // monthly limit per user (Pro plan)

// System prompt — cached by Claude so we only pay for it once per batch
const SCORING_SYSTEM_PROMPT = `You are a lead scoring assistant for TapMe Labs, an NFC business card company in India.

When someone taps a customer's NFC card and fills a contact form, you analyze the submitted data and score the lead.

Return ONLY a valid JSON object with these exact fields:
{
  "score": <number 1-10>,
  "priority": <"hot" | "warm" | "cold">,
  "intent": <string, max 60 chars, e.g. "Bulk purchase inquiry", "General interest", "Price check">,
  "sentiment": <string, max 40 chars, e.g. "Positive and urgent", "Neutral", "Casual inquiry">,
  "summary": <string, max 120 chars, one sentence about this lead>,
  "reply_suggestion": <string, max 200 chars, a warm professional follow-up message>
}

Scoring guide:
- 8-10 (HOT): Clear buying intent, specific requirement, business email, urgency mentioned, bulk order
- 5-7 (WARM): General interest, asking about pricing or details, some contact info provided
- 1-4 (COLD): Vague message, no email, no business context, just curious

Always respond with valid JSON only. No markdown, no explanation.`;

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_api_key_here") {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Build the user message for a single lead
 */
function buildLeadMessage(lead) {
  const fields = [
    lead.name  && `Name: ${lead.name}`,
    lead.email && `Email: ${lead.email}`,
    lead.phone && `Phone: ${lead.phone}`,
  ].filter(Boolean);

  // Include any additional form fields from data
  const extra = Object.entries(lead.data || {})
    .filter(([k]) => !["name", "email", "phone"].includes(k))
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  return [
    "Score this lead:",
    ...fields,
    extra && `Additional info:\n${extra}`,
    `Submitted: ${new Date(lead.createdAt || lead.created_at).toLocaleString("en-IN")}`,
  ].filter(Boolean).join("\n");
}

/**
 * Poll batch until complete or timeout
 */
async function waitForBatch(anthropic, batchId) {
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise(r => setTimeout(r, POLL_DELAY));
    const batch = await anthropic.messages.batches.retrieve(batchId);
    if (batch.processing_status === "ended") return batch;
    console.log(`[scoring] batch ${batchId} status: ${batch.processing_status} (${i + 1}/${MAX_POLLS})`);
  }
  throw new Error(`Batch ${batchId} timed out`);
}

/**
 * Parse Claude's JSON response safely
 */
function parseScore(text) {
  try {
    const cleaned = text.trim().replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * Check if a lead has enough data for meaningful AI scoring.
 * Phone-only leads (no email, no message) are auto-scored without calling Claude.
 */
function hasMinimalData(lead) {
  const data = lead.data || {};
  const values = Object.values(data).map(v => String(v || "").trim());
  // Check if there's any meaningful text beyond name and phone
  const meaningfulValues = values.filter(v => v.length > 3 && !/^\d+$/.test(v));
  const hasEmail = !!lead.email;
  const hasMessage = meaningfulValues.length > 2; // more than just name + phone
  return hasEmail || hasMessage;
}

/**
 * Auto-score a phone-only lead without calling Claude
 */
async function autoScoreMinimalLead(lead) {
  await Lead.update(
    {
      ai_score:            5,
      ai_priority:         "warm",
      ai_intent:           "Phone-only lead — intent unknown",
      ai_sentiment:        "Neutral",
      ai_summary:          `${lead.name || "This lead"} submitted only their name and phone. WhatsApp them to find out why they connected.`,
      ai_reply_suggestion: `Hi ${lead.name || "there"}, thanks for connecting! How can I help you? 😊`,
      ai_scored_at:        new Date(),
      scoring_status:      "scored",
    },
    { where: { id: lead.id } }
  );
}

/**
 * Main scoring function — called by cron job
 */
async function scoreLeads() {
  // Find pending leads (most recent first, up to BATCH_SIZE)
  const leads = await Lead.findAll({
    where: { scoring_status: "pending" },
    order: [["created_at", "DESC"]],
    limit: BATCH_SIZE,
    include: [{ model: User, as: "user", attributes: ["id"] }],
  });

  if (leads.length === 0) {
    console.log("[scoring] No pending leads");
    return { scored: 0, skipped: 0 };
  }

  console.log(`[scoring] Processing ${leads.length} leads`);

  // Split: auto-score minimal leads, send rich leads to Claude
  const minimalLeads = leads.filter(l => !hasMinimalData(l));
  const richLeads    = leads.filter(l =>  hasMinimalData(l));

  // Auto-score phone-only leads instantly (no Claude API call)
  let autoScored = 0;
  for (const lead of minimalLeads) {
    await autoScoreMinimalLead(lead);
    autoScored++;
  }
  if (autoScored > 0) console.log(`[scoring] Auto-scored ${autoScored} phone-only leads`);

  // If no rich leads, we're done
  if (richLeads.length === 0) return { scored: autoScored, skipped: 0 };

  // Get Anthropic client (only needed for rich leads)
  let anthropic;
  try {
    anthropic = getClient();
  } catch (e) {
    console.log("[scoring] Skipping Claude — API key not configured:", e.message);
    return { scored: autoScored, skipped: richLeads.length };
  }

  // Build batch requests
  const requests = richLeads.map(lead => ({
    custom_id: lead.id,
    params: {
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: [
        {
          type:          "text",
          text:          SCORING_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" }, // prompt caching — pay 90% less
        },
      ],
      messages: [
        { role: "user", content: buildLeadMessage(lead) },
      ],
    },
  }));

  // Submit batch
  const batch = await anthropic.messages.batches.create({ requests });
  console.log(`[scoring] Batch submitted: ${batch.id}`);

  // Mark rich leads as "processing" to avoid re-picking them up
  await Lead.update(
    { scoring_status: "processing" },
    { where: { id: { [Op.in]: richLeads.map(l => l.id) } } }
  );

  // Wait for results
  await waitForBatch(anthropic, batch.id);

  // Process results
  let scored = 0;
  let errors = 0;

  for await (const result of await anthropic.messages.batches.results(batch.id)) {
    const leadId = result.custom_id;

    if (result.result.type !== "succeeded") {
      await Lead.update({ scoring_status: "error" }, { where: { id: leadId } });
      errors++;
      continue;
    }

    const text = result.result.message.content?.[0]?.text || "";
    const parsed = parseScore(text);

    if (!parsed) {
      await Lead.update({ scoring_status: "error" }, { where: { id: leadId } });
      errors++;
      continue;
    }

    await Lead.update(
      {
        ai_score:            Math.min(10, Math.max(1, Number(parsed.score) || 5)),
        ai_priority:         ["hot", "warm", "cold"].includes(parsed.priority) ? parsed.priority : "warm",
        ai_intent:           (parsed.intent || "").slice(0, 100),
        ai_sentiment:        (parsed.sentiment || "").slice(0, 50),
        ai_summary:          (parsed.summary || "").slice(0, 500),
        ai_reply_suggestion: (parsed.reply_suggestion || "").slice(0, 1000),
        ai_scored_at:        new Date(),
        scoring_status:      "scored",
      },
      { where: { id: leadId } }
    );
    scored++;
  }

  const total = scored + autoScored;
  console.log(`[scoring] Done — Claude: ${scored}, auto: ${autoScored}, errors: ${errors}`);
  return { scored: total, errors };
}

module.exports = { scoreLeads };
