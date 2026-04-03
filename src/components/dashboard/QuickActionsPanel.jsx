import { Link } from 'react-router-dom';

function QuickActionsPanel({ actions }) {
  return (
    <section className="card">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <p className="text-xs text-slate-500">Smart receptionist shortcuts</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card"
          >
            <p className="text-2xl">{action.icon}</p>
            <h3 className="mt-2 text-sm font-semibold text-slate-800">{action.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuickActionsPanel;
