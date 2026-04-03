function BookingStepHeader({ currentStep }) {
  const steps = [
    { id: 1, label: 'Select Department' },
    { id: 2, label: 'Select Doctor' },
    { id: 3, label: 'Appointment Details' },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {steps.map((step) => {
        const active = step.id === currentStep;
        const done = step.id < currentStep;
        return (
          <div
            key={step.id}
            className={`rounded-xl border px-3 py-2 text-sm transition ${
              active
                ? 'border-med-500 bg-med-50 text-med-700'
                : done
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-500'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">Step {step.id}</p>
            <p className="font-semibold">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export default BookingStepHeader;
