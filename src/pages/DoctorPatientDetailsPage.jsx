import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import PrescriptionForm from '../components/doctor/PrescriptionForm';
import { getDoctorScopedData, saveDoctorPrescription } from '../services/mockDoctorDashboardData';

function DoctorPatientDetailsPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { pushNotification } = useApp();
  const scoped = useMemo(() => getDoctorScopedData(currentUser?.doctorId), [currentUser?.doctorId]);
  const [toast, setToast] = useState('');

  const patient = scoped.patients.find((item) => item.id === id);
  const patientAppointments = scoped.appointments.filter((appointment) => appointment.patient_id === id);
  const patientReports = scoped.reports.filter((report) => report.patient_id === id);

  const notify = (message) => {
    setToast(message);
    pushNotification(message);
    setTimeout(() => setToast(''), 2500);
  };

  const handlePrescriptionSubmit = (formData) => {
    saveDoctorPrescription({
      doctor_id: currentUser.doctorId,
      patient_id: id,
      ...formData,
    });
    notify('Prescription and notes saved successfully.');
  };

  if (!patient) {
    return (
      <div className="page-shell">
        <section className="card text-sm text-slate-600">Patient not found or not assigned to this doctor.</section>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-4">
      {toast ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{toast}</p> : null}

      <section className="card">
        <h2 className="text-xl font-semibold">{patient.fullName}</h2>
        <p className="text-sm text-slate-600">{patient.age} years • {patient.gender} • Blood Group {patient.bloodGroup}</p>
        <p className="text-sm text-slate-600">Phone: {patient.phone} • Email: {patient.email}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="text-lg font-semibold">Medical History</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {patient.medicalHistory.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mt-3 text-sm text-slate-600"><span className="font-semibold">Chronic Conditions:</span> {patient.chronicConditions.join(', ') || 'None'}</p>
          <p className="text-sm text-slate-600"><span className="font-semibold">Allergies:</span> {patient.allergies.join(', ') || 'None'}</p>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">AI Summary</h3>
          <p className="mt-2 text-sm text-slate-600">{patient.aiSummary || 'No AI summary generated yet.'}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="text-lg font-semibold">Previous Appointments</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {patientAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl border border-slate-200 p-2">
                <p className="font-semibold">{appointment.date} • {appointment.time}</p>
                <p>{appointment.reason}</p>
                <p className="text-xs">Status: {appointment.status}</p>
              </div>
            ))}
            {!patientAppointments.length ? <p>No appointment history.</p> : null}
          </div>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Lab Reports</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {patientReports.map((report) => (
              <div key={report.id} className="rounded-xl border border-slate-200 p-2">
                <p className="font-semibold">{report.testType}</p>
                <p>Uploaded: {report.uploadedDate}</p>
                <a className="text-med-700 underline" href={report.fileUrl} target="_blank" rel="noreferrer">Download report</a>
              </div>
            ))}
            {!patientReports.length ? <p>No reports linked.</p> : null}
          </div>
        </article>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Uploaded Files</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {patient.uploadedFiles.map((file) => (
            <a key={file.name} href={file.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary">
              {file.name}
            </a>
          ))}
          {!patient.uploadedFiles.length ? <p className="text-sm text-slate-500">No uploaded files.</p> : null}
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Prescription & Notes</h3>
        <div className="mt-3">
          <PrescriptionForm onSubmit={handlePrescriptionSubmit} />
        </div>
      </section>
    </div>
  );
}

export default DoctorPatientDetailsPage;
