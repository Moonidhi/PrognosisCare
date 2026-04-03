import { Link } from 'react-router-dom';

const badgeStyles = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  ready: 'bg-teal-100 text-teal-700',
};

function UpcomingEventsSection({ events }) {
  return (
    <section className="card">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <p className="text-xs text-slate-500">Appointments, payments, and reports</p>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{event.type}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${badgeStyles[event.status]}`}>
                {event.status}
              </span>
            </div>
            <h3 className="mt-1 text-sm font-semibold">{event.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{event.date}</p>
            <Link to={event.to} className="btn-secondary mt-3">
              {event.action}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UpcomingEventsSection;
