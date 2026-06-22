export default function ShippingPolicyPage() {
  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl text-maroon">Shipping Policy</h1>
      <div className="mt-4 space-y-3 rounded-2xl border border-[#eadfcc] bg-white p-6 text-sm text-stone-700 shadow-card">
        <p>Orders are dispatched within 24-48 business hours.</p>
        <p>Free shipping on prepaid orders above INR 2999 across India.</p>
        <p>Standard delivery timeline: 3-7 business days based on location.</p>
      </div>
    </div>
  );
}

