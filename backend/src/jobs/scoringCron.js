/**
 * Cron job — runs every hour
 * 1. Scores pending leads via Claude Batch API
 * 2. Sends scored leads summary email to card owners
 */

const cron = require("node-cron");
const { scoreLeads }             = require("../services/leadScoringService");
const { sendScoredLeadsSummary } = require("../services/leadSummaryEmailService");

let isRunning = false;

async function runScoringJob() {
  if (isRunning) {
    console.log("[cron] Scoring already in progress — skipping");
    return;
  }

  isRunning = true;
  console.log("[cron] Starting lead scoring job…");

  try {
    const result = await scoreLeads();

    if (result.scored > 0) {
      // Send summary email after scoring completes
      await sendScoredLeadsSummary();
    }

    console.log(`[cron] Job complete — scored: ${result.scored}`);
  } catch (err) {
    console.error("[cron] Scoring job error:", err.message);
  } finally {
    isRunning = false;
  }
}

function startScoringCron() {
  // Run every hour at minute 0
  cron.schedule("0 * * * *", runScoringJob, { timezone: "Asia/Kolkata" });
  console.log("[cron] Lead scoring cron started — runs every hour");
}

// Export for manual trigger (testing)
module.exports = { startScoringCron, runScoringJob };
