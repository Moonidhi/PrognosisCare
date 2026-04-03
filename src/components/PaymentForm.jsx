import { useState } from 'react';

function PaymentForm({ onSubmit, loading }) {
  const [method, setMethod] = useState('card');
  const [details, setDetails] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/29',
    cvv: '123',
    upi: 'patient@upi',
    netBanking: 'HDFC',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ method, details });
  };

  return (
    <form className="card space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Secure Payment</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">🔒 PCI Mock Secure</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {['card', 'upi', 'net-banking'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMethod(item)}
            className={`rounded-xl border px-3 py-2 text-sm font-medium ${
              method === item ? 'border-med-500 bg-med-50 text-med-700' : 'border-slate-200 text-slate-600'
            }`}
          >
            {item === 'card' ? 'Card' : item === 'upi' ? 'UPI' : 'Net Banking'}
          </button>
        ))}
      </div>

      {method === 'card' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-600 sm:col-span-2">
            Card Number
            <input
              className="input mt-1"
              value={details.cardNumber}
              onChange={(e) => setDetails((prev) => ({ ...prev, cardNumber: e.target.value }))}
              required
            />
          </label>
          <label className="text-sm text-slate-600">
            Expiry Date
            <input
              className="input mt-1"
              value={details.expiry}
              onChange={(e) => setDetails((prev) => ({ ...prev, expiry: e.target.value }))}
              required
            />
          </label>
          <label className="text-sm text-slate-600">
            CVV
            <input
              className="input mt-1"
              value={details.cvv}
              onChange={(e) => setDetails((prev) => ({ ...prev, cvv: e.target.value }))}
              required
            />
          </label>
        </div>
      )}

      {method === 'upi' && (
        <label className="text-sm text-slate-600">
          UPI ID
          <input
            className="input mt-1"
            value={details.upi}
            onChange={(e) => setDetails((prev) => ({ ...prev, upi: e.target.value }))}
            required
          />
        </label>
      )}

      {method === 'net-banking' && (
        <label className="text-sm text-slate-600">
          Bank Name
          <input
            className="input mt-1"
            value={details.netBanking}
            onChange={(e) => setDetails((prev) => ({ ...prev, netBanking: e.target.value }))}
            required
          />
        </label>
      )}

      <button className="btn-primary w-full" type="submit" disabled={loading}>
        {loading ? 'Processing Payment...' : 'Pay Securely'}
      </button>
    </form>
  );
}

export default PaymentForm;
