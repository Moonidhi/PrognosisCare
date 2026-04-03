import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingBreakdown, { formatINR } from '../components/BillingBreakdown';
import PaymentForm from '../components/PaymentForm';
import { useApp } from '../context/AppContext';

function PaymentPage() {
  const navigate = useNavigate();
  const { state, loading, paymentError, payForBooking } = useApp();
  const [success, setSuccess] = useState(false);

  const booking = state.latestBooking;

  if (!booking) {
    return (
      <div className="page-shell">
        <section className="card">
          <h2 className="text-xl font-semibold">No Booking Available</h2>
          <button className="btn-primary mt-4" onClick={() => navigate('/lab-booking')}>
            Back to Lab Booking
          </button>
        </section>
      </div>
    );
  }

  const handlePayment = async (payload) => {
    const response = await payForBooking(payload);
    if (!response.ok) return;

    setSuccess(true);
    setTimeout(() => navigate('/booking-confirmation'), 1300);
  };

  return (
    <div className="page-shell grid gap-4 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <PaymentForm onSubmit={handlePayment} loading={loading.payment} />

        {paymentError && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Payment Failed</p>
            <p className="mt-1">{paymentError}</p>
            <button className="btn-secondary mt-3">Retry Payment</button>
          </section>
        )}

        {success && (
          <section className="card text-center">
            <div className="relative mx-auto h-16 w-16 rounded-full bg-emerald-100">
              <div className="absolute inset-0 rounded-full border border-emerald-300 animate-pulseRing" />
              <p className="pt-5 text-2xl text-emerald-700">✓</p>
            </div>
            <p className="mt-3 font-semibold text-emerald-700">Payment Successful</p>
            <p className="text-sm text-slate-500">Generating invoice and redirecting to booking confirmation...</p>
          </section>
        )}
      </div>

      <div className="space-y-4 lg:col-span-2">
        <section className="card">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <p className="mt-2 text-sm text-slate-600">Booking ID: {booking.bookingId}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {booking.tests.map((test) => (
              <li key={test.id} className="flex justify-between">
                <span>{test.name}</span>
                <span>{formatINR(test.cost)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-med-50 p-3">
            <p className="text-xs uppercase tracking-wide text-med-700">Total Amount</p>
            <p className="text-xl font-bold text-med-700">{formatINR(booking.bill.total)}</p>
          </div>
        </section>

        <BillingBreakdown bill={booking.bill} title="Final Billing Details" />
      </div>
    </div>
  );
}

export default PaymentPage;
