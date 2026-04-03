import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function DoctorProfilePage() {
  const { id } = useParams();
  const { state } = useApp();
  const selectedHospitalId = state.patient.selectedHospitalId || state.selectedHospital?.id;
  const doctor = state.doctors.find((item) => item.id === id);
  const fallbackImage =
    doctor?.gender === 'Female'
      ? 'https://randomuser.me/api/portraits/women/44.jpg'
      : 'https://randomuser.me/api/portraits/men/44.jpg';

  if (!doctor || (selectedHospitalId && doctor.hospitalId !== selectedHospitalId)) {
    return (
      <div className="page-shell">
        <section className="card">
          <h2 className="text-xl font-semibold">Doctor Profile Not Found</h2>
          <Link to="/appointments" className="btn-secondary mt-4">
            Back to Appointments
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <div className="flex flex-wrap items-start gap-4">
          <img
            src={doctor.profileImage}
            alt={doctor.fullName}
            className="h-36 w-36 rounded-2xl object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Doctor Profile</p>
            <h2 className="text-2xl font-bold">{doctor.fullName}</h2>
            <p className="text-sm text-slate-600">{doctor.department} • {doctor.specialization}</p>
            <p className="mt-1 text-sm text-slate-600">{doctor.experienceYears} years experience • ₹{doctor.consultationFee} consultation</p>
            <p className="mt-2 text-sm text-slate-600">{doctor.professionalBio}</p>
            <p className="mt-1 text-xs text-slate-500">Hospital Affiliation: {doctor.hospitalAffiliation}</p>
            <Link to="/appointments" className="btn-primary mt-3">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="text-lg font-semibold">Education History</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {doctor.educationHistory.map((item) => (
              <li key={`${item.degree}-${item.year}`} className="rounded-xl border border-slate-100 p-3">
                <p className="font-semibold">{item.degree}</p>
                <p className="text-slate-600">{item.institution}</p>
                <p className="text-xs text-slate-500">{item.year}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Work Experience Timeline</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {doctor.workTimeline.map((item) => (
              <li key={`${item.period}-${item.role}`} className="rounded-xl border border-slate-100 p-3">
                <p className="font-semibold">{item.period}</p>
                <p className="text-slate-600">{item.role}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Certifications</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {doctor.certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Research & Publications</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {doctor.publications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Weekly Availability</h3>
        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available Time Slots</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(doctor.availableTimeSlots.length ? doctor.availableTimeSlots : ['Fully booked']).map((slot) => (
              <span key={slot} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">
                {slot}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(doctor.weeklyAvailability).map(([day, schedule]) => (
            <div key={day} className="rounded-xl border border-slate-100 p-3 text-sm">
              <p className="font-semibold">{day}</p>
              <p className="text-slate-600">{schedule}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Patient Reviews</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {doctor.patientReviews.map((review) => (
            <article key={`${review.reviewer}-${review.comment}`} className="rounded-xl border border-slate-100 p-3">
              <p className="text-sm font-semibold">{review.reviewer}</p>
              <p className="text-xs text-amber-600">{'★'.repeat(review.rating)}</p>
              <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DoctorProfilePage;
