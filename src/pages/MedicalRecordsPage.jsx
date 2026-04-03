import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

function MedicalRecordsPage() {
  const { state, addMedicalRecord, deleteMedicalRecord } = useApp();
  const [recordType, setRecordType] = useState('Prescription');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  const mergedRecords = useMemo(() => {
    const hospitalRecords = state.reports.map((report) => ({
      id: report.reportId,
      fileName: report.fileName,
      recordType: 'Lab Report',
      uploadDate: report.uploadedAt,
      notes: report.testNames?.join(', ') || '',
      source: 'hospital',
      linkedAppointmentId: null,
      linkedDoctorName: '',
      previewUrl: '',
      mimeType: 'application/pdf',
    }));

    const records = [...state.medicalRecords, ...hospitalRecords];
    return records.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [state.medicalRecords, state.reports]);

  const handleSaveRecord = async () => {
    if (!file) return;
    await addMedicalRecord({ file, recordType, notes });
    setFile(null);
    setNotes('');
    setRecordType('Prescription');
  };

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <p className="mt-1 text-sm text-slate-600">All lab reports and diagnostic documents are listed below.</p>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Upload New Record</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-700 sm:col-span-2">
            Upload File
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="input mt-1"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
          <label className="text-sm text-slate-700">
            Record Type
            <select className="input mt-1" value={recordType} onChange={(event) => setRecordType(event.target.value)}>
              <option>Prescription</option>
              <option>Lab Report</option>
              <option>Discharge Summary</option>
              <option>Imaging</option>
              <option>Doctor Note</option>
            </select>
          </label>
          <label className="text-sm text-slate-700">
            Notes
            <input className="input mt-1" value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>
        </div>
        <button type="button" className="btn-primary mt-3" onClick={handleSaveRecord} disabled={!file}>
          Save Record
        </button>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Records List</h3>
        {!mergedRecords.length ? (
          <p className="mt-3 text-sm text-slate-500">No records available yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {mergedRecords.map((record) => (
              <article key={record.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{record.fileName}</p>
                    <p className="text-sm text-slate-600">{record.recordType}</p>
                    <p className="text-xs text-slate-500">Uploaded: {new Date(record.uploadDate).toLocaleString()}</p>
                    {record.notes ? <p className="text-xs text-slate-500">Notes: {record.notes}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      className="btn-secondary"
                      href={record.previewUrl || '#'}
                      download={record.fileName}
                      onClick={(event) => {
                        if (!record.previewUrl) event.preventDefault();
                      }}
                    >
                      Download
                    </a>
                    {record.source === 'user' ? (
                      <button className="btn-secondary" type="button" onClick={() => deleteMedicalRecord(record.id)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
                {record.linkedDoctorName ? (
                  <p className="mt-2 text-xs text-slate-500">Linked appointment: {record.linkedDoctorName}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Records Timeline</h3>
        <div className="mt-3 space-y-3 border-l-2 border-slate-200 pl-4">
          {mergedRecords.map((record) => (
            <div key={`timeline-${record.id}`} className="relative">
              <span className="absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full bg-med-600" />
              <p className="text-sm font-semibold">{record.recordType}: {record.fileName}</p>
              <p className="text-xs text-slate-500">{new Date(record.uploadDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MedicalRecordsPage;
