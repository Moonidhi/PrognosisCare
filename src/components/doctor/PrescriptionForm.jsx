import { useState } from 'react';

function PrescriptionForm({ onSubmit }) {
  const [form, setForm] = useState({
    medication: '',
    dosage: '',
    notes: '',
    labTests: '',
    followUpRequired: false,
    prescriptionFile: null,
  });

  // Minimal structured prescription form for doctor workflow.
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      requestedLabTests: form.labTests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setForm((prev) => ({
      ...prev,
      medication: '',
      dosage: '',
      notes: '',
      labTests: '',
      followUpRequired: false,
      prescriptionFile: null,
    }));
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Medication"
        value={form.medication}
        onChange={(event) => setForm((prev) => ({ ...prev, medication: event.target.value }))}
        required
      />
      <input
        className="input"
        placeholder="Dosage / Frequency"
        value={form.dosage}
        onChange={(event) => setForm((prev) => ({ ...prev, dosage: event.target.value }))}
        required
      />
      <textarea
        className="input"
        rows={3}
        placeholder="Clinical notes"
        value={form.notes}
        onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
      />
      <input
        className="input"
        placeholder="Request additional lab tests (comma separated)"
        value={form.labTests}
        onChange={(event) => setForm((prev) => ({ ...prev, labTests: event.target.value }))}
      />
      <label className="block text-sm text-slate-700">
        Upload prescription file
        <input
          type="file"
          className="input mt-1"
          onChange={(event) => setForm((prev) => ({ ...prev, prescriptionFile: event.target.files?.[0] || null }))}
        />
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.followUpRequired}
          onChange={(event) => setForm((prev) => ({ ...prev, followUpRequired: event.target.checked }))}
        />
        Mark follow-up required
      </label>
      <button className="btn-primary" type="submit">Save Prescription</button>
    </form>
  );
}

export default PrescriptionForm;
