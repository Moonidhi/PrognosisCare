import { Link } from 'react-router-dom';

const statusStyles = {
  available: 'bg-emerald-100 text-emerald-700',
  booked: 'bg-red-100 text-red-700',
};

function DoctorAvailabilitySection({ doctors }) {
  return (
    <section className="card">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold">Doctors Available Today</h2>
        <p className="text-xs text-slate-500">Slide to view more doctors</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="min-w-[260px] rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <img src={doctor.image} alt={doctor.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <h3 className="text-sm font-semibold">{doctor.name}</h3>
                <p className="text-xs text-slate-600">{doctor.department}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600">Next Slot: {doctor.nextSlot}</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusStyles[doctor.status]}`}>
              {doctor.status === 'available' ? 'Available' : 'Fully Booked'}
            </span>

            <Link className="btn-secondary mt-3 w-full" to="/appointments">
              Book Now
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DoctorAvailabilitySection;
