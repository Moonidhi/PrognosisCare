import { Link } from 'react-router-dom';

function DoctorInfoCard({ doctor, showSelectButton = true, selected = false, onSelect }) {
  const fallbackImage =
    doctor.gender === 'Female'
      ? 'https://randomuser.me/api/portraits/women/44.jpg'
      : 'https://randomuser.me/api/portraits/men/44.jpg';

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-card">
      <div className="flex items-start gap-3">
        <img
          src={doctor.profileImage}
          alt={doctor.fullName}
          className="h-16 w-16 rounded-xl object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold">{doctor.fullName}</h3>
          <p className="text-sm text-slate-600">{doctor.specialization}</p>
          <p className="mt-1 text-xs text-slate-500">{doctor.department}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            doctor.availabilityStatus === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {doctor.availabilityStatus}
        </span>
      </div>

      <div className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
        <p><span className="font-semibold">Experience:</span> {doctor.experienceYears} years</p>
        <p><span className="font-semibold">Education:</span> {doctor.educationShort}</p>
        <p className="sm:col-span-2"><span className="font-semibold">Languages:</span> {doctor.languages.join(', ')}</p>
        <p><span className="font-semibold">Consultation Fee:</span> ₹{doctor.consultationFee}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link className="btn-secondary" to={`/doctor/${doctor.id}`}>
          View Profile
        </Link>
        {showSelectButton ? (
          <button
            type="button"
            className={`btn-primary ${selected ? 'ring-4 ring-med-100' : ''}`}
            onClick={() => onSelect?.(doctor)}
            disabled={doctor.availabilityStatus !== 'Available'}
          >
            {selected ? 'Selected Doctor' : 'Select Doctor'}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default DoctorInfoCard;
