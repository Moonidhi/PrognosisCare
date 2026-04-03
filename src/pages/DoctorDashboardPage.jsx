import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import AppointmentTimeline from '../components/doctor/AppointmentTimeline';
import {
  getDoctorScopedData,
  updateDoctorAppointment,
  updateDoctorReport,
  upsertDoctorProfile,
} from '../services/mockDoctorDashboardData';

function parseTime(timeText) {
  const match = timeText.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function getStatusClass(status) {
  if (status === 'Completed') return 'bg-emerald-100 text-emerald-700';
  if (status === 'Cancelled') return 'bg-red-100 text-red-700';
  return 'bg-blue-100 text-blue-700';
}

function DoctorDashboardPage() {
  const { currentUser, logout } = useAuth();
  const { state, updateDoctor, updateAppointmentStatus, cancelAppointment, pushNotification } = useApp();
  const navigate = useNavigate();
  const [online, setOnline] = useState(true);
  const [toast, setToast] = useState('');

  const doctor = state.doctors.find((item) => item.id === currentUser?.doctorId);
  const scoped = useMemo(() => getDoctorScopedData(currentUser?.doctorId), [currentUser?.doctorId]);
  // Merge Global State Appointments with Mock Data for demonstration
  // In a real app, all would come from state or backend.
  // We prioritize state appointments (new bookings) and add mock ones if needed, 
  // or just use state if we want to be clean.
  // Let's use state.appointments primarily, but if empty, fall back to mock for demo.

  const doctorAppointments = useMemo(() => {
    // Filter global appointments for this doctor
    const realAppointments = state.appointments.filter(
      (appt) => appt.doctorId === currentUser?.doctorId || appt.doctor_id === currentUser?.doctorId
    );

    // If we have real appointments, use them. 
    // Otherwise, for demo purposes, use the scoped mock data.
    // actually, let's combine them so we see both pre-seeded and new ones.
    return [...realAppointments, ...scoped.appointments].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
  }, [state.appointments, currentUser?.doctorId, scoped.appointments]);

  const patientMap = useMemo(() => {
    const mockPatients = Object.fromEntries(scoped.patients.map((patient) => [patient.id, patient]));
    // We also need to map patient details from the appointment itself if not in mockPatients
    // The appointment object has patientName, but for detailed view we might need more.
    // For now, we'll just use what we have.
    return mockPatients;
  }, [scoped.patients]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = doctorAppointments
    .filter((appointment) => appointment.date === today)
    .sort((first, second) => parseTime(first.time) - parseTime(second.time));

  const upcomingAppointments = doctorAppointments
    .filter((appointment) => appointment.date > today || (appointment.date === today && parseTime(appointment.time) >= parseTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))))
    .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`));

  const currentMinutes = parseTime(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );

  const ongoing = todaysAppointments.find((appointment) => Math.abs(parseTime(appointment.time) - currentMinutes) <= 30);
  const next = todaysAppointments.find((appointment) => parseTime(appointment.time) > currentMinutes);

  const pendingReports = scoped.reports.filter((report) => report.status === 'Pending');

  const totalConsultations = doctorAppointments.filter((appointment) => appointment.status === 'Completed').length;
  const consultationFee = doctor?.consultationFee || 0;
  const todayEarnings = todaysAppointments.filter((appointment) => appointment.status === 'Completed').length * consultationFee;
  const monthlyEarnings = doctorAppointments.filter((appointment) => appointment.status === 'Completed').length * consultationFee;

  const profileState = useMemo(
    () => ({
      fee: doctor?.consultationFee || 0,
      languages: (doctor?.languages || []).join(', '),
      bio: doctor?.professionalBio || '',
      photo: doctor?.profileImage || '',
      availability: doctor?.weeklyAvailability?.Monday || '9:00 AM - 5:00 PM',
    }),
    [doctor]
  );
  const [profileForm, setProfileForm] = useState(profileState);

  const notify = (message) => {
    setToast(message);
    pushNotification(message);
    setTimeout(() => setToast(''), 2500);
  };

  const handleComplete = (appointmentId) => {
    updateDoctorAppointment(appointmentId, { status: 'Completed' });

    const appAppointment = state.appointments.find((item) => item.id === appointmentId);
    if (appAppointment) updateAppointmentStatus(appointmentId, 'Completed');

    notify('Appointment marked as completed.');
  };

  const handleCancel = (appointmentId) => {
    updateDoctorAppointment(appointmentId, { status: 'Cancelled' });

    const appAppointment = state.appointments.find((item) => item.id === appointmentId);
    if (appAppointment) cancelAppointment(appointmentId);

    notify('Appointment cancelled.');
  };

  const saveProfile = () => {
    const patch = {
      consultationFee: Number(profileForm.fee),
      languages: profileForm.languages
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      professionalBio: profileForm.bio,
      profileImage: profileForm.photo,
      weeklyAvailability: {
        ...(doctor?.weeklyAvailability || {}),
        Monday: profileForm.availability,
      },
    };

    updateDoctor(doctor.id, patch);
    upsertDoctorProfile(doctor.id, patch);
    notify('Doctor profile updated successfully.');
  };

  const approveReport = (reportId) => {
    updateDoctorReport(reportId, { status: 'Approved' });
    notify('Report approved.');
  };

  const addReportRemarks = (reportId) => {
    const note = window.prompt('Add diagnosis remarks:', '');
    if (!note) return;
    updateDoctorReport(reportId, { remarks: note });
    notify('Remarks added.');
  };

  if (!doctor) {
    return (
      <div className="page-shell">
        <section className="card text-sm text-slate-600">Doctor profile not found. Please contact administrator.</section>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-4">
      {toast ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{toast}</p> : null}

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={doctor.profileImage} alt={doctor.fullName} className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-semibold">{doctor.fullName}</h2>
              <p className="text-sm text-slate-600">{doctor.specialization}</p>
              <p className="text-xs text-slate-500">{doctor.hospitalAffiliation} • {doctor.experienceYears} years experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`rounded-xl px-3 py-2 text-sm font-semibold ${online ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`} onClick={() => setOnline((prev) => !prev)}>
              {online ? 'Online' : 'Offline'}
            </button>
            <button className="btn-secondary" onClick={logout}>Logout</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <article className="card">
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
          <p className="mt-1 text-sm text-slate-500">Timeline view of your schedule.</p>
          <div className="mt-4">
            <AppointmentTimeline
              appointments={todaysAppointments}
              patientMap={patientMap}
              ongoingId={ongoing?.id}
              nextId={next?.id}
              onViewDetails={(patientId) => navigate(`/doctor/patient/${patientId}`)}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        </article>

        <article className="card space-y-3">
          <h3 className="text-lg font-semibold">Earnings Summary</h3>
          <p className="text-sm text-slate-600">Today's earnings: ₹{todayEarnings}</p>
          <p className="text-sm text-slate-600">Monthly earnings: ₹{monthlyEarnings}</p>
          <p className="text-sm text-slate-600">Total consultations: {totalConsultations}</p>
          <p className="text-sm text-slate-600">Consultation fee: ₹{consultationFee}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <article className="card">
          <h3 className="text-lg font-semibold">Upcoming Schedule</h3>
          <div className="mt-3 space-y-2">
            {upcomingAppointments.map((appointment) => (
              <article key={appointment.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{appointment.date} • {appointment.time}</p>
                    <p className="text-sm text-slate-600">{patientMap[appointment.patient_id]?.fullName} • {appointment.department}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <button className="btn-secondary mt-2" onClick={() => navigate(`/doctor/patient/${appointment.patient_id}`)}>
                  Quick View
                </button>
              </article>
            ))}
            {!upcomingAppointments.length ? <p className="text-sm text-slate-500">No upcoming schedule.</p> : null}
          </div>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Calendar</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {[...new Set(upcomingAppointments.map((appointment) => appointment.date))].slice(0, 6).map((date) => (
              <p key={date} className="rounded-lg bg-slate-100 px-3 py-2">{date}</p>
            ))}
            {!upcomingAppointments.length ? <p>No upcoming dates.</p> : null}
          </div>
        </article>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Pending Lab Reports</h3>
        <div className="mt-3 space-y-2">
          {pendingReports.map((report) => (
            <article key={report.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{patientMap[report.patient_id]?.fullName}</p>
                  <p className="text-sm text-slate-600">{report.testType} • Uploaded {report.uploadedDate}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={report.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary">Download</a>
                  <button className="btn-secondary" onClick={() => addReportRemarks(report.id)}>Add Remarks</button>
                  <button className="btn-primary" onClick={() => approveReport(report.id)}>Approve</button>
                </div>
              </div>
            </article>
          ))}
          {!pendingReports.length ? <p className="text-sm text-slate-500">No pending lab reports.</p> : null}
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Profile Management</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Availability schedule" value={profileForm.availability} onChange={(event) => setProfileForm((prev) => ({ ...prev, availability: event.target.value }))} />
          <input className="input" type="number" placeholder="Consultation fee" value={profileForm.fee} onChange={(event) => setProfileForm((prev) => ({ ...prev, fee: event.target.value }))} />
          <input className="input" placeholder="Languages" value={profileForm.languages} onChange={(event) => setProfileForm((prev) => ({ ...prev, languages: event.target.value }))} />
          <input className="input" placeholder="Profile photo URL" value={profileForm.photo} onChange={(event) => setProfileForm((prev) => ({ ...prev, photo: event.target.value }))} />
          <textarea className="input sm:col-span-2" rows={3} placeholder="Short bio" value={profileForm.bio} onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))} />
        </div>
        <button className="btn-primary mt-3" onClick={saveProfile}>Save Profile</button>
      </section>
    </div>
  );
}

export default DoctorDashboardPage;
