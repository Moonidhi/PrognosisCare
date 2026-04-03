import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

function HospitalDashboardPage() {
  const { currentUser } = useAuth();
  const { state, updateAppointmentStatus, cancelAppointment } = useApp();

  console.log('🏥 Hospital Dashboard - Current User:', currentUser);

  // Filter appointments for the entire hospital
  // If we had a backend, this would be a query. For mock state, we filter by hospitalName matching.
  // Note: Appointments in mock state might not have hospitalName directly, but we can try to match by doctor's hospital.
  // For simplicity in this mock, we assume appointments having 'hospitalName' or we match by doctor.

  // Let's rely on matching doctor's hospital from state.doctors if available, or just filter by hospitalName if stored on appointment.
  // In our mock data, appointments have 'doctor_id'. We can find the doctor and check their hospital.

  const hospitalAppointments = useMemo(() => {
    const hospitalId = currentUser?.hospitalId;
    const hospitalName = currentUser?.hospitalName?.trim().toLowerCase();
    if (!hospitalId && !hospitalName) return [];

    return state.appointments.filter((app) => {
      if (hospitalId && (app.hospital_id === hospitalId || app.hospitalId === hospitalId)) {
        return true;
      }

      if (hospitalName && app.hospitalName?.trim().toLowerCase() === hospitalName) {
        return true;
      }

      const doctorRef = app.doctor_id || app.doctorId;
      const doc = state.doctors.find((doctor) => doctor.id === doctorRef);
      if (!doc) return false;

      if (hospitalId && doc.hospitalId === hospitalId) {
        return true;
      }

      return hospitalName ? doc.hospitalName?.trim().toLowerCase() === hospitalName : false;
    });
  }, [state.appointments, currentUser?.hospitalId, currentUser?.hospitalName, state.doctors]);

  const doctorAppointments = hospitalAppointments; // Alias for compatibility with existing code structure below

  console.log('✅ Hospital Appointments Found:', doctorAppointments.length);

  console.log('✅ Doctor Appointments Found:', doctorAppointments.length);

  const todayDate = new Date().toISOString().slice(0, 10);
  const todaysAppointments = doctorAppointments.filter((appointment) => appointment.date === todayDate);
  const upcomingAppointments = doctorAppointments.filter((appointment) => appointment.date >= todayDate && appointment.status !== 'Cancelled');
  const completedAppointments = doctorAppointments.filter((appointment) => appointment.status === 'Completed');

  // Group appointments by patient to show patient progress
  const patientGroups = useMemo(() => {
    const groups = {};
    doctorAppointments.forEach((appointment) => {
      const patientKey = appointment.patientName || 'Unknown Patient';
      if (!groups[patientKey]) {
        groups[patientKey] = [];
      }
      groups[patientKey].push(appointment);
    });
    return groups;
  }, [doctorAppointments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const isToday = (dateString) => {
    return dateString === todayDate;
  };

  // Calculate revenue from appointments
  const totalRevenue = useMemo(() => {
    return completedAppointments.reduce((sum, apt) => sum + (apt.consultationFee || 0), 0);
  }, [completedAppointments]);

  const potentialRevenue = useMemo(() => {
    return upcomingAppointments.reduce((sum, apt) => sum + (apt.consultationFee || 0), 0);
  }, [upcomingAppointments]);

  const cancelledAppointments = doctorAppointments.filter((apt) => apt.status === 'Cancelled');
  const uniquePatients = new Set(doctorAppointments.map((apt) => apt.patientName)).size;

  // Group today's appointments by time for schedule view
  const todaysSchedule = useMemo(() => {
    return [...todaysAppointments].sort((a, b) => {
      const timeA = a.time.toLowerCase().replace(/[^0-9:]/g, '');
      const timeB = b.time.toLowerCase().replace(/[^0-9:]/g, '');
      return timeA.localeCompare(timeB);
    });
  }, [todaysAppointments]);

  const handleRefreshData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="page-shell space-y-4">
      {/* Data Refresh Button */}
      {doctorAppointments.length === 0 && (
        <div className="card bg-yellow-50 border-yellow-300 border-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-yellow-900">⚠️ No Appointments Found</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Click the button to refresh and load sample appointment data for Dr. {currentUser?.name}
              </p>
            </div>
            <button
              onClick={handleRefreshData}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      )}

      <section className="card bg-gradient-to-r from-med-50 to-blue-50 border-med-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Hospital Administration</p>
            <h2 className="mt-1 text-2xl font-bold text-med-900">{currentUser?.hospitalName}</h2>
            <p className="mt-1 text-sm text-slate-700 font-medium">Administrator Dashboard</p>
            <p className="mt-2 text-xs text-slate-500">
              📧 {currentUser?.email}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Today's Date</p>
            <p className="text-sm font-semibold text-med-700">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-medium">Today's Schedule</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{todaysAppointments.length}</p>
              <p className="text-xs text-slate-500 mt-1">appointments</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </article>
        <article className="card bg-emerald-50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-medium">Upcoming</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">{upcomingAppointments.length}</p>
              <p className="text-xs text-slate-500 mt-1">scheduled</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </article>
        <article className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{completedAppointments.length}</p>
              <p className="text-xs text-green-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </article>
        <article className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{uniquePatients}</p>
              <p className="text-xs text-slate-500 mt-1">unique</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </article>
        <article className="card bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-medium">Potential Revenue</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">₹{potentialRevenue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 mt-1">from upcoming</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </article>
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-med-900">📋 Today's Schedule</h3>
            <p className="text-sm text-slate-600 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Consultations</p>
            <p className="text-lg font-bold text-med-700">{todaysAppointments.length}</p>
          </div>
        </div>
        {todaysSchedule.length > 0 ? (
          <div className="space-y-3">
            {todaysSchedule.map((appointment) => (
              <article key={appointment.id} className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🕐</span>
                      <p className="font-bold text-xl text-blue-900">{appointment.time}</p>
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">TODAY</span>
                    </div>
                    <div className="ml-10">
                      <p className="font-bold text-lg text-slate-900">{appointment.patientName || 'Patient Name Not Provided'}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-semibold">Patient ID:</span> {appointment.patient_id}
                      </p>
                      <p className="text-sm text-slate-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                        <span className="font-semibold text-amber-900">Chief Complaint:</span><br />
                        {appointment.reason}
                      </p>
                      <p className="text-xs text-slate-600 mt-2">
                        <span className="font-semibold">Doctor:</span> {appointment.doctorName || 'Not specified'}
                      </p>
                      {appointment.uploadedMedicalFile && (
                        <div className="text-xs text-blue-600 mt-2 flex items-center gap-2">
                          <span>📎</span>
                          <span><span className="font-semibold">Medical File:</span> {appointment.uploadedMedicalFile.fileName}</span>
                          {appointment.uploadedMedicalFile.previewUrl ? (
                            <a
                              href={appointment.uploadedMedicalFile.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline"
                            >
                              View
                            </a>
                          ) : null}
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        <span className="font-semibold">Fee:</span> ₹{appointment.consultationFee} •
                        <span className="font-semibold">Apt ID:</span> {appointment.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                      <button
                        className="btn-secondary text-xs"
                        onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No appointments scheduled for today.</p>
        )}
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-med-900">📅 All Appointments</h3>
          <div className="flex gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {upcomingAppointments.length} Upcoming
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              {completedAppointments.length} Completed
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-3">Complete history of your patient consultations</p>
        {doctorAppointments.length > 0 ? (
          <div className="space-y-2">
            {doctorAppointments.map((appointment) => (
              <article key={appointment.id} className={`rounded-lg border p-3 ${appointment.status === 'Completed' ? 'bg-green-50 border-green-200' :
                appointment.status === 'Cancelled' ? 'bg-red-50 border-red-200' :
                  isToday(appointment.date) ? 'bg-blue-50 border-blue-300 border-2' :
                    'bg-white border-slate-200'
                }`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-base text-slate-900">{appointment.patientName || 'Not specified'}</p>
                      {isToday(appointment.date) && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">TODAY</span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-700">
                        <span className="font-semibold">📅 Date & Time:</span> {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-slate-700">
                        <span className="font-semibold">👤 Patient ID:</span> {appointment.patient_id}
                      </p>
                      <p className="text-slate-700">
                        <span className="font-semibold">🩺 Doctor:</span> {appointment.doctorName || 'Not specified'}
                      </p>
                      <p className="text-slate-700">
                        <span className="font-semibold">🩺 Chief Complaint:</span> {appointment.reason}
                      </p>
                      <p className="text-slate-700">
                        <span className="font-semibold">💵 Consultation Fee:</span> ₹{appointment.consultationFee}
                      </p>
                      {appointment.uploadedMedicalFile && (
                        <div className="text-xs text-blue-600 flex items-center gap-2 mt-1">
                          <span>📎</span>
                          <span><span className="font-semibold">Attachment:</span> {appointment.uploadedMedicalFile.fileName}</span>
                          {appointment.uploadedMedicalFile.previewUrl ? (
                            <a
                              href={appointment.uploadedMedicalFile.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline"
                            >
                              View
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                      <>
                        <button
                          className="btn-secondary text-xs"
                          onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                        >
                          Mark Complete
                        </button>
                        <button
                          className="btn-secondary text-xs"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No appointments found for this hospital.</p>
        )}
      </section>

      <section className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
          👥 Patient Progress Tracker
        </h3>
        <p className="text-sm text-slate-700 mt-1 mb-4">View complete appointment history grouped by patient</p>
        {Object.keys(patientGroups).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(patientGroups).map(([patientName, appointments]) => {
              const completedCount = appointments.filter(a => a.status === 'Completed').length;
              const upcomingCount = appointments.filter(a => a.status === 'Upcoming').length;
              const totalFees = appointments.filter(a => a.status === 'Completed').reduce((sum, a) => sum + (a.consultationFee || 0), 0);

              return (
                <article key={patientName} className="rounded-xl border-2 border-purple-300 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3 pb-3 border-b border-purple-200">
                    <div>
                      <h4 className="font-bold text-lg text-purple-900 flex items-center gap-2">
                        <span>👤</span>
                        {patientName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Patient ID: {appointments[0].patient_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 mb-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          {completedCount} Completed
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          {upcomingCount} Upcoming
                        </span>
                      </div>
                      {totalFees > 0 && (
                        <p className="text-xs text-slate-600">
                          Total Revenue: <span className="font-bold text-green-700">₹{totalFees.toLocaleString('en-IN')}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((appointment) => (
                      <div key={appointment.id} className={`rounded-lg p-3 text-sm border-l-4 ${appointment.status === 'Completed' ? 'bg-green-50 border-green-500' :
                        appointment.status === 'Cancelled' ? 'bg-red-50 border-red-500' :
                          'bg-blue-50 border-blue-500'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-slate-900">{appointment.date}</p>
                              <span className="text-xs text-slate-500">at {appointment.time}</span>
                              {isToday(appointment.date) && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">TODAY</span>
                              )}
                            </div>
                            <p className="text-slate-700 text-xs mt-1">
                              <span className="font-semibold">Chief Complaint:</span> {appointment.reason}
                            </p>
                            <p className="text-slate-600 text-xs mt-1">
                              <span className="font-semibold">Fee:</span> ₹{appointment.consultationFee} •
                              <span className="font-semibold"> ID:</span> {appointment.id}
                            </p>
                            {appointment.uploadedMedicalFile && (
                              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                📎 {appointment.uploadedMedicalFile.fileName}
                              </p>
                            )}
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No patient data available yet.</p>
        )}
      </section>

      <section className="card bg-gradient-to-br from-med-50 to-purple-50 border-med-300">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-med-600 flex items-center justify-center text-white text-3xl font-bold">
            {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-med-900">Admin Profile</h3>
            <div className="mt-3 grid gap-2">
              <div className="flex items-start gap-2">
                <span className="text-med-600 font-semibold min-w-[120px]">👨‍💼 Name:</span>
                <span className="text-slate-700">{currentUser?.name}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-med-600 font-semibold min-w-[120px]">🏢 Hospital:</span>
                <span className="text-slate-700">{currentUser?.hospitalName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-med-600 font-semibold min-w-[120px]">📧 Email:</span>
                <span className="text-slate-700">{currentUser?.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-med-600 font-semibold min-w-[120px]">🆔 Admin ID:</span>
                <span className="text-slate-700">{currentUser?.id}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-med-200">
              <h4 className="font-semibold text-med-800 mb-2">📊 Performance Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-2 border border-med-200">
                  <p className="text-xs text-slate-500">Total Appointments</p>
                  <p className="text-lg font-bold text-med-700">{doctorAppointments.length}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-green-200">
                  <p className="text-xs text-slate-500">Completed</p>
                  <p className="text-lg font-bold text-green-700">{completedAppointments.length}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-red-200">
                  <p className="text-xs text-slate-500">Cancelled</p>
                  <p className="text-lg font-bold text-red-700">{cancelledAppointments.length}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-purple-200">
                  <p className="text-xs text-slate-500">Patients Served</p>
                  <p className="text-lg font-bold text-purple-700">{uniquePatients}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HospitalDashboardPage;
