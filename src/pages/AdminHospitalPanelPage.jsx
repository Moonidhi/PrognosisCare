import { useState } from 'react';
import { useApp } from '../context/AppContext';

function AdminHospitalPanelPage() {
  const { state, loading, markTestCompleted, uploadReport } = useApp();
  const [fileName, setFileName] = useState('cardiac-panel-report.pdf');

  const booking = state.latestBooking;

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs uppercase tracking-[0.2em] text-med-600">Hospital Admin View</p>
        <h2 className="text-xl font-semibold">Lab Booking Operations Panel</h2>
      </section>

      {!booking ? (
        <section className="card">
          <p className="text-sm text-slate-500">No incoming bookings yet.</p>
        </section>
      ) : (
        <section className="card space-y-4">
          <div className="grid gap-3 rounded-xl border border-slate-100 p-4 text-sm sm:grid-cols-2">
            <p><span className="font-semibold">Booking ID:</span> {booking.bookingId}</p>
            <p><span className="font-semibold">Patient:</span> {booking.patient.name}</p>
            <p><span className="font-semibold">Payment:</span> {booking.paymentStatus}</p>
            <p><span className="font-semibold">Schedule:</span> {new Date(booking.slot).toLocaleString()}</p>
            <p className="sm:col-span-2"><span className="font-semibold">Tests:</span> {booking.tests.map((t) => t.name).join(', ')}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={markTestCompleted}>Mark Test as Completed</button>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">Upload Test Report (PDF Simulation)</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <input className="input max-w-sm" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              <button
                className="btn-primary"
                onClick={() => uploadReport(fileName)}
                disabled={loading.reportUpload}
              >
                {loading.reportUpload ? 'Uploading...' : 'Upload Report'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminHospitalPanelPage;
