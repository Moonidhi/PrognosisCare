import { useMemo, useState } from 'react';

function HospitalSelectionModal({ hospitals, initialHospitalId, onConfirm }) {
  const defaultHospitalId = useMemo(() => {
    if (initialHospitalId && hospitals.some((hospital) => hospital.id === initialHospitalId)) {
      return initialHospitalId;
    }
    return hospitals[0]?.id || '';
  }, [hospitals, initialHospitalId]);

  const [selectedHospitalId, setSelectedHospitalId] = useState(defaultHospitalId);

  const handleConfirm = () => {
    if (!selectedHospitalId) return;
    onConfirm(selectedHospitalId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Hospital Selection</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">Choose your hospital</h3>
        <p className="mt-2 text-sm text-slate-600">
          You will only see doctors, departments, and services for the hospital you select.
        </p>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Contracted Hospital
          <select
            className="input mt-2"
            value={selectedHospitalId}
            onChange={(event) => setSelectedHospitalId(event.target.value)}
            required
          >
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn-primary mt-6 w-full" onClick={handleConfirm} disabled={!selectedHospitalId}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default HospitalSelectionModal;
