import { Link } from 'react-router-dom';
import { slugifyDepartment } from '../services/mockDoctorsData';
import { useApp } from '../context/AppContext';

function OpdDepartmentsPage() {
  const { state } = useApp();
  const selectedHospitalId = state.patient.selectedHospitalId || state.selectedHospital?.id;
  const visibleDepartments = [...new Set(
    state.doctors
      .filter((doctor) => doctor.hospitalId === selectedHospitalId)
      .map((doctor) => doctor.department)
  )];

  return (
    <div className="page-shell">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">OPD Directory</p>
        <h2 className="mt-1 text-xl font-semibold">Explore OPD Departments</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDepartments.map((department) => (
            <Link
              key={department}
              to={`/opd-departments/${slugifyDepartment(department)}`}
              className="rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {department}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OpdDepartmentsPage;
