"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

// ── Shared input class ────────────────────────────────────────────────────────

const inp = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white";

// ── Helper components (kept from existing design) ─────────────────────────────

function Section({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-6" style={{ border: "1px solid #E2E8F0" }}>
      <h3 className="mb-4 text-[14px] font-semibold text-slate-800">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-slate-600">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function SaveRow({ saving, saved }) {
  return (
    <div className="flex items-center justify-end gap-3">
      {saved && (
        <span className="text-[12px] font-medium" style={{ color: "#16A34A" }}>
          ✓ Settings saved successfully
        </span>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg px-5 py-2.5 text-[13px] font-semibold text-black disabled:opacity-60"
        style={{ background: "#28DC4F" }}
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "brand",    label: "Brand"    },
  { id: "shipping", label: "Shipping" },
  { id: "payment",  label: "Payment"  },
  { id: "general",  label: "General"  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("brand");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  // ── Form state ─────────────────────────────────────────────────────────────

  const [brand, setBrand] = useState({
    brand_name:       "TapMe Labs",
    logo:             "",                       // populated via upload API later
    support_email:    "support@tapmelabs.com",
    whatsapp_number:  "+91 98765 00000",
  });

  const [shipping, setShipping] = useState({
    free_shipping_min:   "999",
    dispatch_time:       "1-2",                 // business days
    delivery_estimate:   "3–5 business days",
  });

  const [payment, setPayment] = useState({
    razorpay_key:  "",
    stripe_key:    "",
    payment_mode:  "test",                      // "test" | "live"
  });

  const [general, setGeneral] = useState({
    website_url:  "https://tapmelabs.com",
    admin_url:    "https://admin.tapmelabs.com",
    currency:     "INR",
  });

  // ── Save handler (frontend-only — simulates API call) ─────────────────────
  // TODO: Replace the setTimeout with a real PUT /api/admin/settings call.
  // Send all four sections in one request body:
  //   { brand, shipping, payment: { payment_mode }, general }
  // Note: Razorpay/Stripe keys should be sent separately to a secure
  //   POST /api/admin/settings/payment-keys endpoint (never log these).

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Settings">
      <div className="mx-auto max-w-3xl">

        {/* Tab bar */}
        <div className="mb-6 flex gap-1 rounded-xl bg-white p-1" style={{ border: "1px solid #E2E8F0" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex-1 rounded-lg py-2 text-[13px] font-medium transition-colors"
              style={{
                background: activeTab === t.id ? "#0F172A" : "transparent",
                color:      activeTab === t.id ? "#FFFFFF" : "#64748B",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Brand Settings ───────────────────────────────────────────────── */}
        {activeTab === "brand" && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">

            <Section title="Brand Settings">
              <Grid>
                <Field label="Brand Name">
                  <input
                    value={brand.brand_name}
                    onChange={(e) => setBrand({ ...brand, brand_name: e.target.value })}
                    className={inp}
                    placeholder="TapMe Labs"
                  />
                </Field>

                <Field
                  label="Support Email"
                  hint="Shown on order confirmation emails and invoice."
                >
                  <input
                    type="email"
                    value={brand.support_email}
                    onChange={(e) => setBrand({ ...brand, support_email: e.target.value })}
                    className={inp}
                    placeholder="support@tapmelabs.com"
                  />
                </Field>

                <Field
                  label="WhatsApp Support Number"
                  hint="Include country code, e.g. +91 98765 00000"
                >
                  <input
                    value={brand.whatsapp_number}
                    onChange={(e) => setBrand({ ...brand, whatsapp_number: e.target.value })}
                    className={inp}
                    placeholder="+91 98765 00000"
                  />
                </Field>
              </Grid>

              {/* Logo */}
              <Field
                label="Brand Logo"
                hint="Paste a direct image URL for now. Upload support coming soon."
              >
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    {/*
                      TODO: Replace this text input with a file upload button.
                      Call POST /api/uploads/logo (multipart/form-data, field: "file"),
                      then set brand.logo to the returned { url } value.
                    */}
                    <input
                      value={brand.logo}
                      onChange={(e) => setBrand({ ...brand, logo: e.target.value })}
                      className={inp}
                      placeholder="https://… (paste URL)"
                    />
                  </div>
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt="Logo preview"
                      className="h-10 w-10 rounded-lg object-contain border border-slate-200"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
              </Field>
            </Section>

            <SaveRow saving={saving} saved={saved} />
          </form>
        )}

        {/* ── Shipping Settings ────────────────────────────────────────────── */}
        {activeTab === "shipping" && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">

            <Section title="Shipping Settings">
              <Grid>
                <Field
                  label="Free Shipping Minimum (₹)"
                  hint="Orders above this amount get free shipping."
                >
                  <input
                    type="number"
                    min="0"
                    value={shipping.free_shipping_min}
                    onChange={(e) => setShipping({ ...shipping, free_shipping_min: e.target.value })}
                    className={inp}
                    placeholder="999"
                  />
                </Field>

                <Field
                  label="Default Dispatch Time (business days)"
                  hint="Shown to customers at checkout."
                >
                  <input
                    value={shipping.dispatch_time}
                    onChange={(e) => setShipping({ ...shipping, dispatch_time: e.target.value })}
                    className={inp}
                    placeholder="1-2"
                  />
                </Field>

                <Field
                  label="Delivery Estimate Text"
                  hint="Free-text label shown on product and order pages."
                >
                  <input
                    value={shipping.delivery_estimate}
                    onChange={(e) => setShipping({ ...shipping, delivery_estimate: e.target.value })}
                    className={inp}
                    placeholder="3–5 business days"
                  />
                </Field>
              </Grid>
            </Section>

            {/* TODO: When backend is ready, add courier partner settings here:
                 - Shiprocket API key  →  POST /api/admin/settings/shipping/shiprocket
                 - Delhivery API key   →  POST /api/admin/settings/shipping/delhivery
            */}

            <SaveRow saving={saving} saved={saved} />
          </form>
        )}

        {/* ── Payment Settings ─────────────────────────────────────────────── */}
        {activeTab === "payment" && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">

            {/* Warning banner */}
            <div className="rounded-lg px-4 py-3 text-[13px]"
              style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}>
              <p className="font-semibold mb-0.5">Payment gateway not connected yet.</p>
              <p className="text-[12px]">
                These fields are placeholders only. Do not enter real production keys until
                the backend payment integration is complete.
              </p>
            </div>

            {/*
              TODO: Connect payment keys to a secure backend endpoint.
              - POST /api/admin/settings/payment-keys  { provider, key_id, key_secret }
              - Never expose key_secret in GET responses — write-only field.
              - Switch payment_mode between test/live before going live.
              - Razorpay integration: use razorpay npm package in orderController.
              - Stripe integration: use stripe npm package in orderController.
            */}

            <Section title="Razorpay">
              <Grid>
                <Field label="Razorpay Key ID" hint="Starts with rzp_test_ or rzp_live_">
                  <input
                    type="password"
                    value={payment.razorpay_key}
                    onChange={(e) => setPayment({ ...payment, razorpay_key: e.target.value })}
                    className={inp}
                    placeholder="rzp_test_••••••••••••"
                    autoComplete="off"
                  />
                </Field>
              </Grid>
            </Section>

            <Section title="Stripe">
              <Grid>
                <Field label="Stripe Publishable Key" hint="Starts with pk_test_ or pk_live_">
                  <input
                    type="password"
                    value={payment.stripe_key}
                    onChange={(e) => setPayment({ ...payment, stripe_key: e.target.value })}
                    className={inp}
                    placeholder="pk_test_••••••••••••"
                    autoComplete="off"
                  />
                </Field>
              </Grid>
            </Section>

            <Section title="Payment Mode">
              <div className="flex gap-3">
                {["test", "live"].map((mode) => (
                  <label
                    key={mode}
                    className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg p-4"
                    style={{
                      border: payment.payment_mode === mode ? "2px solid #28DC4F" : "1px solid #E2E8F0",
                      background: payment.payment_mode === mode ? "#F0FDF4" : "#FFFFFF",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_mode"
                      value={mode}
                      checked={payment.payment_mode === mode}
                      onChange={() => setPayment({ ...payment, payment_mode: mode })}
                      className="accent-green-500"
                    />
                    <div>
                      <p className="text-[13px] font-semibold capitalize text-slate-800">{mode} Mode</p>
                      <p className="text-[11px] text-slate-400">
                        {mode === "test"
                          ? "Use sandbox credentials — no real charges."
                          : "Use live credentials — real charges apply."}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            <SaveRow saving={saving} saved={saved} />
          </form>
        )}

        {/* ── General Settings ─────────────────────────────────────────────── */}
        {activeTab === "general" && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">

            <Section title="General Settings">
              <Grid>
                <Field label="Website URL" hint="Customer-facing website.">
                  <input
                    type="url"
                    value={general.website_url}
                    onChange={(e) => setGeneral({ ...general, website_url: e.target.value })}
                    className={inp}
                    placeholder="https://tapmelabs.com"
                  />
                </Field>

                <Field label="Admin Panel URL" hint="URL of this admin dashboard.">
                  <input
                    type="url"
                    value={general.admin_url}
                    onChange={(e) => setGeneral({ ...general, admin_url: e.target.value })}
                    className={inp}
                    placeholder="https://admin.tapmelabs.com"
                  />
                </Field>

                <Field label="Default Currency">
                  <select
                    value={general.currency}
                    onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                    className={inp}
                  >
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="AED">AED (د.إ) — UAE Dirham</option>
                  </select>
                </Field>
              </Grid>
            </Section>

            {/*
              TODO: When backend settings API is ready, load saved values on mount:
                GET /api/admin/settings  →  populate brand / shipping / payment / general state.
              Also persist on save:
                PUT /api/admin/settings  →  send updated state.
            */}

            <SaveRow saving={saving} saved={saved} />
          </form>
        )}

      </div>
    </AdminLayout>
  );
}
