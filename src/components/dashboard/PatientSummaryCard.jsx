function getAgeFromDob(dob) {
  if (!dob) return '--';
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return '--';
  const diffMs = Date.now() - date.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const riskColors = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

function PatientSummaryCard({ patient }) {
  const age = getAgeFromDob(patient.dob);
  const risk = patient.riskLevel || 'low';

  return (
    <section className="card grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold">Patient Summary</h2>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="font-semibold">Full Name:</span> {patient.name}</p>
          <p><span className="font-semibold">Age:</span> {age}</p>
          <p><span className="font-semibold">Blood Group:</span> {patient.bloodGroup || '--'}</p>
          <p><span className="font-semibold">Gender:</span> {patient.gender || '--'}</p>
          <p><span className="font-semibold">Emergency Contact:</span> {patient.emergencyContact || '--'}</p>
          <p><span className="font-semibold">Last Checkup Date:</span> {patient.lastCheckupDate ? new Date(patient.lastCheckupDate).toLocaleDateString() : '--'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clinical Risk Indicator</p>
        <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${riskColors[risk]}`}>
          {risk} Risk
        </span>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">AI Status</p>
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-med-100 px-3 py-1 text-xs font-semibold text-med-700">
          <span className="inline-block h-2 w-2 rounded-full bg-med-600" /> AI Monitoring Active
        </p>
      </div>
    </section>
  );
}

export default PatientSummaryCard;
