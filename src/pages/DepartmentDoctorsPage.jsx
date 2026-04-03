import { Link, useParams } from 'react-router-dom';
import DoctorInfoCard from '../components/doctors/DoctorInfoCard';
import { getDepartmentNameFromSlug } from '../services/mockDoctorsData';
import { useApp } from '../context/AppContext';

function DepartmentDoctorsPage() {
  const { departmentSlug } = useParams();
  const { state } = useApp();
  const departmentName = getDepartmentNameFromSlug(departmentSlug);
  const selectedHospitalId = state.patient.selectedHospitalId || state.selectedHospital?.id;

  if (!departmentName) {
    return (
      <div className="page-shell">
        <section className="card">
          <h2 className="text-xl font-semibold">Department not found</h2>
          <Link to="/opd-departments" className="btn-secondary mt-4">
            Back to OPD Directory
          </Link>
        </section>
      </div>
    );
  }

  const departmentDoctors = state.doctors.filter(
    (doctor) => doctor.department === departmentName && doctor.hospitalId === selectedHospitalId
  );

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Department Doctors</p>
        <h2 className="mt-1 text-xl font-semibold">{departmentName}</h2>
        <p className="mt-1 text-sm text-slate-600">Browse doctors and open full profiles.</p>
      </section>

      <section className="grid gap-3">
        {departmentDoctors.map((doctor) => (
          <DoctorInfoCard key={doctor.id} doctor={doctor} showSelectButton={false} />
        ))}
      </section>
    </div>
  );
}

export default DepartmentDoctorsPage;
