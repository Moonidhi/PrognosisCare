import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getHospitalAccounts,
  getHospitalRequests,
  getPlatformLogs,
  reviewHospitalRequest,
  updateHospitalStatus,
} from '../services/adminStore';

function getLicenseType(request) {
  if (request.licenseFileType?.includes('pdf')) return 'pdf';
  if (request.licenseFileType?.includes('image')) return 'image';
  const ext = request.licenseFileName?.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'image';
  return 'unknown';
}

function SuperAdminDashboardPage() {
  const { state, addDepartment, editDepartment, deleteDepartment } = useApp();
  const [requests, setRequests] = useState(getHospitalRequests());
  const [hospitals, setHospitals] = useState(getHospitalAccounts());
  const [logs, setLogs] = useState(getPlatformLogs());
  const [departmentInput, setDepartmentInput] = useState('');
  const [editingDepartment, setEditingDepartment] = useState({ old: '', value: '' });
  const [reasonInputs, setReasonInputs] = useState({});
  const [previewModal, setPreviewModal] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });

  const pendingRequests = requests.filter((request) => request.status === 'Pending Approval');
  const approvedHospitals = hospitals.filter((hospital) => hospital.status !== 'Rejected');

  const analytics = useMemo(() => {
    const totalPatients = state.patient?.name ? 1 : 0;
    const totalAppointments = state.appointments.length;
    const revenue = state.appointments
      .filter((appointment) => appointment.status !== 'Cancelled')
      .reduce((sum, appointment) => sum + Number(appointment.consultationFee || 0), 0);

    return {
      totalDoctors: state.doctors.length,
      totalPatients,
      totalAppointments,
      revenue,
    };
  }, [state.appointments, state.doctors.length, state.patient?.name]);

  const refreshData = () => {
    setRequests(getHospitalRequests());
    setHospitals(getHospitalAccounts());
    setLogs(getPlatformLogs());
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 3000);
  };

  // Decision handler for approval workflow actions.
  const handleReview = (request, decision) => {
    const reason = (reasonInputs[request.id] || '').trim();

    if (decision === 'reject' && !reason) {
      showToast('error', 'Rejection reason is required.');
      return;
    }

    if (decision === 'more-info' && !reason) {
      showToast('error', 'Clarification note is required.');
      return;
    }

    reviewHospitalRequest(request.id, decision, reason);
    setReasonInputs((prev) => ({ ...prev, [request.id]: '' }));
    refreshData();
    showToast('success', decision === 'approve' ? 'Hospital approved successfully.' : 'Request updated successfully.');
  };

  const handleSuspendToggle = (hospital) => {
    const nextStatus = hospital.status === 'Suspended' ? 'Active' : 'Suspended';
    updateHospitalStatus(hospital.id, nextStatus);
    refreshData();
  };

  const renderLicensePreview = (request) => {
    const type = getLicenseType(request);

    if (!request.licenseFileDataUrl) {
      return <p className="text-xs text-slate-500">Preview unavailable. File was not uploaded with preview data.</p>;
    }

    if (type === 'pdf') {
      return <iframe title={request.licenseFileName} src={request.licenseFileDataUrl} className="h-44 w-full rounded-lg border border-slate-200" />;
    }

    if (type === 'image') {
      return <img src={request.licenseFileDataUrl} alt={request.licenseFileName} className="h-44 w-full rounded-lg border border-slate-200 object-cover" />;
    }

    return <p className="text-xs text-slate-500">Unsupported file type for preview.</p>;
  };

  const triggerDownload = (request) => {
    if (!request.licenseFileDataUrl) {
      showToast('error', 'Download unavailable for this file.');
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = request.licenseFileDataUrl;
    anchor.download = request.licenseFileName || 'hospital-license';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="page-shell space-y-4">
      {toast.message ? (
        <div
          className={`rounded-xl p-3 text-sm ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Company Control Center</p>
        <h2 className="mt-1 text-xl font-semibold">Super Admin Dashboard</h2>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="card"><p className="text-xs text-slate-500">Pending Hospital Requests</p><p className="text-2xl font-bold text-med-700">{pendingRequests.length}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Approved Hospitals</p><p className="text-2xl font-bold text-med-700">{approvedHospitals.length}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Total Doctors</p><p className="text-2xl font-bold text-med-700">{analytics.totalDoctors}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Total Patients</p><p className="text-2xl font-bold text-med-700">{analytics.totalPatients}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Total Appointments</p><p className="text-2xl font-bold text-med-700">{analytics.totalAppointments}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Revenue Overview</p><p className="text-2xl font-bold text-med-700">₹{analytics.revenue}</p></article>
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold">Pending Hospital Requests</h3>
        {!pendingRequests.length ? (
          <p className="text-sm text-slate-500">No pending requests.</p>
        ) : (
          pendingRequests.map((request) => (
            <article key={request.id} className="rounded-xl border border-slate-100 p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr,280px]">
                <div className="space-y-1 text-sm">
                  <p className="text-base font-semibold">{request.hospitalName}</p>
                  <p className="text-slate-600">Admin: {request.adminName}</p>
                  <p className="text-slate-600">Email: {request.contactEmail}</p>
                  <p className="text-slate-600">Phone: {request.phone}</p>
                  <p className="text-slate-600">Submitted: {new Date(request.submittedAt).toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">License Preview</p>
                  {renderLicensePreview(request)}
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary" onClick={() => setPreviewModal(request)}>Expand</button>
                    <button className="btn-secondary" onClick={() => triggerDownload(request)}>Download</button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <input
                  className="input"
                  placeholder="Reason (required for Reject / Clarification)"
                  value={reasonInputs[request.id] || ''}
                  onChange={(event) =>
                    setReasonInputs((prev) => ({
                      ...prev,
                      [request.id]: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-primary" onClick={() => handleReview(request, 'approve')}>Approve</button>
                <button className="btn-secondary" onClick={() => handleReview(request, 'reject')}>Reject</button>
                <button className="btn-secondary" onClick={() => handleReview(request, 'more-info')}>Request clarification</button>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold">Approved Hospitals</h3>
        {approvedHospitals.map((hospital) => (
          <article key={hospital.id} className="rounded-xl border border-slate-100 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{hospital.hospitalName}</p>
                <p className="text-sm text-slate-600">{hospital.city}, {hospital.state}</p>
                <p className="text-xs text-slate-500">Status: {hospital.status}</p>
              </div>
              <button className="btn-secondary" onClick={() => handleSuspendToggle(hospital)}>
                {hospital.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Manage Departments</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="input max-w-sm" value={departmentInput} onChange={(event) => setDepartmentInput(event.target.value)} placeholder="Add new department" />
          <button
            className="btn-primary"
            onClick={() => {
              addDepartment(departmentInput);
              setDepartmentInput('');
            }}
          >
            Add
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {state.departments.map((department) => (
            <article key={department} className="rounded-xl border border-slate-100 p-2 text-sm">
              {editingDepartment.old === department ? (
                <div className="space-y-2">
                  <input className="input" value={editingDepartment.value} onChange={(event) => setEditingDepartment({ old: department, value: event.target.value })} />
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={() => {
                      editDepartment(department, editingDepartment.value);
                      setEditingDepartment({ old: '', value: '' });
                    }}>Save</button>
                    <button className="btn-secondary" onClick={() => setEditingDepartment({ old: '', value: '' })}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span>{department}</span>
                  <div className="flex gap-1">
                    <button className="btn-secondary" onClick={() => setEditingDepartment({ old: department, value: department })}>Edit</button>
                    <button className="btn-secondary" onClick={() => deleteDepartment(department)}>Delete</button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="text-lg font-semibold">All Doctors</h3>
          <div className="mt-3 max-h-72 space-y-2 overflow-auto">
            {state.doctors.map((doctor) => (
              <div key={doctor.id} className="rounded-xl border border-slate-100 p-2 text-sm">
                <p className="font-semibold">{doctor.fullName}</p>
                <p className="text-slate-600">{doctor.department} • {doctor.hospitalAffiliation}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">System Appointments</h3>
          <div className="mt-3 max-h-72 space-y-2 overflow-auto">
            {state.appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl border border-slate-100 p-2 text-sm">
                <p className="font-semibold">{appointment.id} • {appointment.doctorName}</p>
                <p className="text-slate-600">{appointment.department} • {appointment.date} {appointment.time}</p>
                <p className="text-xs text-slate-500">Status: {appointment.status}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Platform Activity Logs</h3>
        <div className="mt-3 max-h-56 space-y-2 overflow-auto">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-100 p-2 text-sm">
              <p className="font-semibold">{log.action}</p>
              <p className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()} • {log.actor}</p>
            </div>
          ))}
        </div>
      </section>

      {previewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold">{previewModal.licenseFileName}</h4>
              <button className="btn-secondary" onClick={() => setPreviewModal(null)}>Close</button>
            </div>
            {getLicenseType(previewModal) === 'pdf' ? (
              <iframe title={previewModal.licenseFileName} src={previewModal.licenseFileDataUrl} className="h-[70vh] w-full rounded-xl border border-slate-200" />
            ) : (
              <img src={previewModal.licenseFileDataUrl} alt={previewModal.licenseFileName} className="h-[70vh] w-full rounded-xl border border-slate-200 object-contain" />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SuperAdminDashboardPage;
