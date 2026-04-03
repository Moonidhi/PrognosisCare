import { useApp } from '../context/AppContext';

function NotificationToast() {
  const { state } = useApp();
  const latest = state.notifications[0];

  if (!latest) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 max-w-sm animate-fadeIn rounded-2xl border border-med-100 bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-med-600">Notification</p>
      <p className="mt-1 text-sm text-slate-700">{latest.message}</p>
    </div>
  );
}

export default NotificationToast;
