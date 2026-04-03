import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

function DashboardHeader({ patientName }) {
  const { logout } = useAuth();
  const { state } = useApp();

  return (
    <section className="card flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=160&q=80"
          alt="Patient profile"
          className="h-14 w-14 rounded-full border-2 border-med-100 object-cover"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-med-600">Smart Reception Desk</p>
          <h1 className="text-2xl font-bold">Good Morning, {patientName || 'Patient'}</h1>
          <p className="text-sm text-slate-600">How can we assist you today?</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          🔔 <span className="ml-1 font-semibold">{state.notifications.length}</span>
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          aria-label="Settings"
        >
          ⚙️
        </button>
        <button type="button" className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </section>
  );
}

export default DashboardHeader;
