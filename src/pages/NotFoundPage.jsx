import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page-shell">
      <section className="card text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">The requested page could not be found.</p>
        <Link className="btn-primary mt-4" to="/">
          Back to Dashboard
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
