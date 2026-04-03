import { useNavigate } from 'react-router-dom';
import UrgencyBadge from './UrgencyBadge';
import { formatINR } from './BillingBreakdown';

function RecommendedTestsCard({ tests = [], summary, onProceed }) {
  const navigate = useNavigate();
  const safeTests = Array.isArray(tests) ? tests : [];
  const safeSummary = typeof summary === 'string' ? summary : '';
  const total = safeTests.reduce((sum, test) => sum + (Number(test.cost) || 0), 0);

  const handleProceed = () => {
    onProceed?.();
    navigate('/lab-booking');
  };

  if (!safeTests.length) {
    return (
      <section className="card">
        <h2 className="text-xl font-semibold">Recommended Tests</h2>
        <p className="mt-2 text-sm text-slate-600">
          {safeSummary || 'No tests are needed right now based on the symptoms provided. If symptoms worsen or continue, consult a doctor.'}
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recommended Tests</h2>
          <p className="mt-1 text-sm text-slate-600">{safeSummary}</p>
        </div>
        <div className="rounded-xl bg-med-50 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-wide text-med-700">Estimated Bill</p>
          <p className="text-lg font-bold text-med-700">{formatINR(total)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {safeTests.map((test) => (
          <article key={test.id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold">{test.name}</p>
                <p className="mt-1 text-sm text-slate-600">{test.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <UrgencyBadge level={test.priority} />
                <p className="text-sm font-semibold text-slate-700">{formatINR(test.cost)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button type="button" className="btn-primary" onClick={handleProceed}>
          Proceed to Book Test
        </button>
      </div>
    </section>
  );
}

export default RecommendedTestsCard;
