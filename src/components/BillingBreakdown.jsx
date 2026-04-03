function formatINR(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function BillingBreakdown({ bill, title = 'Billing Breakdown' }) {
  if (!bill) return null;

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-500">Transparent itemized estimate</p>
      </div>

      <div className="space-y-3">
        {bill.rows.map((row) => (
          <div key={row.name} className="rounded-xl border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{row.name}</p>
              <p className="font-semibold">{formatINR(row.total)}</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-600 sm:grid-cols-4">
              <p>Price: {formatINR(row.basePrice)}</p>
              <p>After Insurance: {formatINR(row.discountedPrice)}</p>
              <p>Service Fee: {formatINR(row.serviceFee)}</p>
              <p>Tax: {formatINR(row.tax)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatINR(bill.subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>Service Fees</span>
          <span>{formatINR(bill.fees)}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>Taxes</span>
          <span>{formatINR(bill.taxes)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-med-700">
          <span>Total Payable</span>
          <span>{formatINR(bill.total)}</span>
        </div>
      </div>
    </section>
  );
}

export { formatINR };
export default BillingBreakdown;
