"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PublicFormPage() {
  const { slug }     = useParams();
  const searchParams = useSearchParams();
  const isEmbed      = searchParams.get("embed") === "1"; // no header/footer when embedded
  const [form,    setForm]    = useState(null);
  const [values,  setValues]  = useState({});
  const [state,   setState]   = useState("loading"); // loading | ready | submitting | done | error
  const [errMsg,  setErrMsg]  = useState("");

  useEffect(() => {
    fetch(`${API}/forms/public/${slug}`)
      .then(r => r.json())
      .then(d => { if (d.success) { setForm(d.form); setState("ready"); } else setState("error"); })
      .catch(() => setState("error"));
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setState("submitting");
    try {
      const res  = await fetch(`${API}/forms/public/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setState("done");
    } catch (err) {
      setErrMsg(err.message || "Something went wrong. Please try again.");
      setState("ready");
    }
  }

  if (state === "loading") return (
    <>
      {!isEmbed && <Header />}
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#28DC4F]" />
      </div>
      {!isEmbed && <Footer />}
    </>
  );

  if (state === "error") return (
    <>
      {!isEmbed && <Header />}
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-[22px] font-bold text-[#111827]">Form Not Found</h1>
        <p className="text-[14px] text-[#6D6D6D]">This form is no longer available.</p>
      </main>
      {!isEmbed && <Footer />}
    </>
  );

  if (state === "done") return (
    <>
      {!isEmbed && <Header />}
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#28DC4F" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M7 18L14 25L29 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Thank You!</h1>
          <p className="mt-2 text-[15px] text-[#6D6D6D] max-w-sm mx-auto">{form?.thank_you_message}</p>
        </div>
      </main>
      {!isEmbed && <Footer />}
    </>
  );

  return (
    <>
      {!isEmbed && <Header />}
      <main className={isEmbed ? "bg-white" : "min-h-screen bg-[#F9F9F9]"}>
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">

          {/* Card owner info */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#28DC4F" }}>
              <span className="text-[20px] font-bold text-black">
                {form?.user?.full_name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <h1 className="text-[20px] font-bold text-[#111827]">{form?.title}</h1>
            {form?.description && (
              <p className="mt-1 text-[14px] text-[#6D6D6D]">{form.description}</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#F0F0F0] bg-white p-6 shadow-sm">
            {errMsg && (
              <div className="mb-4 rounded-xl px-4 py-3 text-[13px]" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
                {errMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {(form?.fields || []).map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#374151]">
                    {field.label}
                    {field.required && <span className="ml-1 text-[#EF4444]">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea required={field.required} rows={3}
                      placeholder={field.placeholder || ""}
                      value={values[field.id] || ""}
                      onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))}
                      className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#1E1E1E] outline-none resize-none focus:border-[#28DC4F] focus:bg-white" />
                  ) : field.type === "select" ? (
                    <select required={field.required}
                      value={values[field.id] || ""}
                      onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))}
                      className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-4 py-[13px] text-[14px] text-[#1E1E1E] outline-none focus:border-[#28DC4F] focus:bg-white">
                      <option value="">{field.placeholder || "Select an option…"}</option>
                      {(field.options || []).filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" required={field.required}
                        checked={!!values[field.id]}
                        onChange={e => setValues(p => ({ ...p, [field.id]: e.target.checked }))
                        } className="w-4 h-4 accent-[#28DC4F]" />
                      <span className="text-[14px] text-[#374151]">{field.placeholder || field.label}</span>
                    </label>
                  ) : (
                    <input type={field.type || "text"} required={field.required}
                      placeholder={field.placeholder || ""}
                      value={values[field.id] || ""}
                      onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))}
                      className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-4 py-[13px] text-[14px] text-[#1E1E1E] outline-none focus:border-[#28DC4F] focus:bg-white" />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black disabled:opacity-60"
                style={{ background: "#28DC4F" }}
              >
                {state === "submitting" ? "Submitting…" : "Submit"}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] text-[#9CA3AF]">
              Powered by <span style={{ color: "#28DC4F" }}>TapMe Labs</span>
            </p>
          </div>
        </div>
      </main>
      {!isEmbed && <Footer />}
    </>
  );
}
