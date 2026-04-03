import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function BookingConfirmationPage() {
  const { state } = useApp();
  const booking = state.latestBooking;
  const invoiceRef = useRef(null);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${booking?.bookingId || 'unknown'}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const handleAddToCalendar = () => {
    if (!booking) return;

    const startTime = new Date(booking.slot);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

    const formatTime = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const details = `Booking ID: ${booking.bookingId}\nTests: ${booking.tests.map((t) => t.name).join(', ')}`;
    const location = `${booking.hospital.name}, ${booking.hospital.address}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Lab Test Appointment&dates=${formatTime(startTime)}/${formatTime(endTime)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    window.open(url, '_blank');
  };

  if (!booking || booking.paymentStatus !== 'paid') {
    return (
      <div className="page-shell">
        <section className="card">
          <h2 className="text-xl font-semibold">No Paid Booking Found</h2>
          <p className="mt-2 text-sm text-slate-600">Complete payment to access booking confirmation.</p>
        </section>
      </div>
    );
  }

  const schedule = new Date(booking.slot).toLocaleString();

  return (
    <div className="page-shell">
      <section ref={invoiceRef} className="card animate-fadeIn">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Booking Confirmed</p>
        <h2 className="mt-1 text-2xl font-bold">Your Lab Test Is Scheduled</h2>

        <div className="mt-4 grid gap-3 rounded-xl border border-slate-200 p-4 text-sm sm:grid-cols-2">
          <p>
            <span className="font-semibold">Booking ID:</span> {booking.bookingId}
          </p>
          <p>
            <span className="font-semibold">Invoice ID:</span> {booking.payment.invoiceId}
          </p>
          <p>
            <span className="font-semibold">Hospital:</span> {booking.hospital.name}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {booking.hospital.address}
          </p>
          <p>
            <span className="font-semibold">Scheduled:</span> {schedule}
          </p>
          <p>
            <span className="font-semibold">Payment Status:</span> Paid
          </p>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">Test Details</p>
          <ul className="space-y-1 text-sm text-slate-700">
            {booking.tests.map((test) => (
              <li key={test.id}>• {test.name}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" data-html2canvas-ignore="true">
          <button onClick={handleDownloadInvoice} className="btn-primary">
            Download Invoice
          </button>
          <button onClick={handleAddToCalendar} className="btn-secondary">
            Add to Calendar
          </button>
        </div>
      </section>
    </div>
  );
}

export default BookingConfirmationPage;
