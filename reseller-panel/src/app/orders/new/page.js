"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResellerLayout from "@/components/ResellerLayout";
import orderService from "@/services/orderService";
import commissionService from "@/services/commissionService";
import api from "@/services/api";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function NewOrderPage() {
  const router = useRouter();
  const [products, setProducts]   = useState([]);
  const [stats, setStats]         = useState(null);
  const [form, setForm]           = useState({
    product_id: "", customer_name: "", customer_phone: "", customer_email: "",
    use_commission_amount: 0,
    shipping_address: { name: "", address: "", city: "", state: "", pincode: "", phone: "" },
  });
  const [selected, setSelected]   = useState(null);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/products?status=active"),
      commissionService.dashboardStats(),
    ]).then(([p, s]) => {
      setProducts(p.data.products || p.data || []);
      setStats(s.data);
    });
  }, []);

  useEffect(() => {
    if (form.product_id) {
      setSelected(products.find((p) => p.id === form.product_id) || null);
    }
  }, [form.product_id, products]);

  const price           = Number(selected?.sale_price || selected?.price || 0);
  const balance         = Number(stats?.commission_balance || 0);
  const useComm         = Math.min(Math.max(0, Number(form.use_commission_amount)), balance, price);
  const razorpayAmount  = Math.max(0, price - useComm);
  const commissionEarn  = stats ? (price * Number(stats.commission_rate) / 100) : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Create reseller order
      const { data } = await orderService.create({
        ...form,
        use_commission_amount: useComm,
        card_customization: {},
      });
      const ro = data.reseller_order;

      // 2. If fully paid via commission — go to orders
      if (razorpayAmount === 0) {
        router.push(`/orders/${ro.id}?success=1`);
        return;
      }

      // 3. Open Razorpay for remaining amount
      await loadRazorpay();
      const { data: rzp } = await orderService.createPayment(ro.id);

      let paymentDone = false;
      let rzpInst;

      const options = {
        key:      rzp.key_id,
        amount:   rzp.amount,
        currency: rzp.currency,
        order_id: rzp.razorpay_order_id,
        name:     "TAPME Labs",
        description: "NFC Card Order",
        theme: { color: "#28DC4F" },
        handler: async (response) => {
          try {
            await orderService.verifyPayment({
              reseller_order_id:   ro.id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            paymentDone = true;
            rzpInst.close();
            router.push(`/orders/${ro.id}?success=1`);
          } catch {
            setError("Payment verification failed. Contact support.");
            rzpInst.close();
          }
        },
        modal: {
          ondismiss: () => {
            if (!paymentDone) setError("Payment cancelled.");
          },
        },
      };

      rzpInst = new window.Razorpay(options);
      rzpInst.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#28DC4F]";

  return (
    <ResellerLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-[18px] font-bold text-[#111827]">New Order</h2>
          <p className="text-[13px] text-[#6B7280]">Create a card order for your customer</p>
        </div>

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-[#111827]">1. Product</h3>
            <select required value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className={inp}>
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ₹{Number(p.sale_price || p.price).toLocaleString("en-IN")}</option>
              ))}
            </select>
            {selected && (
              <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[13px]">
                <p className="font-semibold text-[#16a34a]">₹{Number(selected.sale_price || selected.price).toLocaleString("en-IN")}</p>
                <p className="text-[#6B7280] mt-0.5">You earn ₹{commissionEarn.toFixed(2)} ({stats?.commission_rate}% commission)</p>
              </div>
            )}
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
            <h3 className="text-[14px] font-semibold text-[#111827]">2. Customer Info</h3>
            <input className={inp} placeholder="Customer name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            <input className={inp} placeholder="Customer phone" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
            <input className={inp} type="email" placeholder="Customer email (optional)" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
            <h3 className="text-[14px] font-semibold text-[#111827]">3. Shipping Address</h3>
            {["name","address","city","state","pincode","phone"].map((f) => (
              <input key={f} className={inp} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={form.shipping_address[f]}
                onChange={(e) => setForm({ ...form, shipping_address: { ...form.shipping_address, [f]: e.target.value } })}
              />
            ))}
          </div>

          {/* Payment */}
          {selected && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
              <h3 className="text-[14px] font-semibold text-[#111827]">4. Payment</h3>
              <div className="flex items-center justify-between text-[13px] text-[#6B7280]">
                <span>Commission balance</span>
                <span className="font-semibold text-[#16a34a]">₹{balance.toFixed(2)}</span>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1">Use commission (₹)</label>
                <input type="number" min={0} max={Math.min(balance, price)} step="0.01"
                  className={inp} value={form.use_commission_amount}
                  onChange={(e) => setForm({ ...form, use_commission_amount: e.target.value })}
                />
              </div>
              <div className="pt-2 border-t border-[#F1F5F9] space-y-1 text-[13px]">
                <div className="flex justify-between"><span className="text-[#6B7280]">Order total</span><span>₹{price.toFixed(2)}</span></div>
                {useComm > 0 && <div className="flex justify-between"><span className="text-[#6B7280]">Commission applied</span><span className="text-[#16a34a]">− ₹{useComm.toFixed(2)}</span></div>}
                <div className="flex justify-between font-semibold text-[15px]">
                  <span>Pay via Razorpay</span>
                  <span>₹{razorpayAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading || !form.product_id}
            className="w-full bg-[#28DC4F] text-black font-semibold text-[14px] py-3 rounded-xl hover:bg-[#22c946] transition-colors disabled:opacity-60"
          >
            {loading ? "Processing…" : razorpayAmount === 0 ? "Place Order (Commission)" : `Pay ₹${razorpayAmount.toFixed(2)} & Place Order`}
          </button>
        </form>
      </div>
    </ResellerLayout>
  );
}
