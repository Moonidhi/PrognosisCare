import { useNavigate } from 'react-router-dom';

function PortalBackButton({ fallbackPath = '/auth' }) {
  const navigate = useNavigate();

  // Reusable back action for portal screens.
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath);
  };

  return (
    <button
      type="button"
      className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      onClick={handleBack}
    >
      ← Back
    </button>
  );
}

export default PortalBackButton;
