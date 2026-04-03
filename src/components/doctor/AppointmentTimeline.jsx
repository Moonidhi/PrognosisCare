function riskBadgeClass(riskLevel) {
  if (riskLevel?.toLowerCase() === 'high') return 'bg-red-100 text-red-700';
  if (riskLevel?.toLowerCase() === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
}

function AppointmentTimeline({ appointments, patientMap, onViewDetails, onComplete, onCancel, ongoingId, nextId }) {
  if (!appointments.length) {
    return <p className="text-sm text-slate-500">No appointments for today.</p>;
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const patient = patientMap[appointment.patient_id];
        const isOngoing = appointment.id === ongoingId;
        const isNext = appointment.id === nextId;

        return (
          <article
            key={appointment.id}
            className={`rounded-2xl border p-4 shadow-sm transition ${
              isOngoing
                ? 'border-med-500 bg-med-50'
                : isNext
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{appointment.time}</p>
                <p className="text-xs text-slate-500">{isOngoing ? 'Current ongoing appointment' : isNext ? 'Next appointment' : 'Scheduled'}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${riskBadgeClass(appointment.riskLevel)}`}>
                {appointment.riskLevel} Risk
              </span>
            </div>

            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="font-semibold">Patient:</span> {patient?.fullName || 'Unknown'}</p>
              <p><span className="font-semibold">Age:</span> {patient?.age || '-'} yrs</p>
              <p className="sm:col-span-2"><span className="font-semibold">Reason:</span> {appointment.reason}</p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {(patient?.uploadedFiles || []).map((file) => (
                <a
                  key={file.name}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                >
                  {file.name}
                </a>
              ))}
              {!patient?.uploadedFiles?.length ? <p className="text-xs text-slate-500">No uploaded files</p> : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => onViewDetails(appointment.patient_id)}>View Full Details</button>
              <button className="btn-primary" onClick={() => onComplete(appointment.id)}>Mark as Completed</button>
              <button className="btn-secondary" onClick={() => onCancel(appointment.id)}>Cancel</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default AppointmentTimeline;
