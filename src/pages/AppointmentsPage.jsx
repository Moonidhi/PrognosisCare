import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStepHeader from '../components/appointments/BookingStepHeader';
import DoctorInfoCard from '../components/doctors/DoctorInfoCard';
import { useApp } from '../context/AppContext';

function AppointmentsPage() {
  const navigate = useNavigate();
  const { state, addAppointment, loading } = useApp();
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [recordFile, setRecordFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const selectedHospitalId = state.patient.selectedHospitalId || state.selectedHospital?.id;
  const hospitalDoctors = useMemo(
    () => state.doctors.filter((doctor) => doctor.hospitalId === selectedHospitalId),
    [selectedHospitalId, state.doctors]
  );

  const hospitalDepartments = useMemo(
    () => [...new Set(hospitalDoctors.map((doctor) => doctor.department))],
    [hospitalDoctors]
  );

  const departmentDoctors = useMemo(
    () =>
      selectedDepartment
        ? hospitalDoctors.filter((doctor) => doctor.department === selectedDepartment)
        : hospitalDoctors,
    [selectedDepartment, hospitalDoctors]
  );

  const availableSlots = selectedDoctor?.availableTimeSlots || [];

  const handleConfirm = async () => {
    if (!selectedDoctor || !appointmentDate || !selectedSlot || !reason.trim()) {
      return;
    }

    setUploadProgress(0);
    let progress = 0;
    const timer = setInterval(() => {
      progress += 20;
      setUploadProgress(Math.min(progress, 90));
    }, 120);

    const appointment = await addAppointment({
      doctor: selectedDoctor,
      department: selectedDepartment,
      date: appointmentDate,
      time: selectedSlot,
      reason,
      file: recordFile,
      recordType: 'Appointment Attachment',
    });

    clearInterval(timer);
    setUploadProgress(100);

    if (!appointment) return;

    setConfirmedAppointment({
      appointmentId: appointment.id,
      department: appointment.department,
      doctorName: appointment.doctorName,
      date: appointment.date,
      slot: appointment.time,
      reason: appointment.reason,
      attachment: appointment.uploadedMedicalFile?.fileName || 'No attachment',
    });

    setTimeout(() => navigate('/my-appointments'), 900);
  };

  return (
    <div className="page-shell space-y-4">
      <section className="card space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Appointments</p>
          <h2 className="mt-1 text-xl font-semibold">Book Appointment</h2>
          <p className="mt-1 text-sm text-slate-600">
            Complete the booking in 3 quick steps for {state.selectedHospital.name}.
          </p>
        </div>

        <BookingStepHeader currentStep={step} />

        {step === 1 ? (
          <div>
            <p className="mb-3 text-sm font-semibold">Step 1: Select Department</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {hospitalDepartments.map((department) => (
                <button
                  key={department}
                  type="button"
                  onClick={() => setSelectedDepartment(department)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selectedDepartment === department
                      ? 'border-med-500 bg-med-50 text-med-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {department}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!selectedDepartment}
              >
                Continue to Doctors
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <p className="mb-3 text-sm font-semibold">Step 2: Select Doctor</p>
            <div className="grid gap-3">
              {departmentDoctors.map((doctor) => (
                <DoctorInfoCard
                  key={doctor.id}
                  doctor={doctor}
                  selected={selectedDoctor?.id === doctor.id}
                  onSelect={setSelectedDoctor}
                />
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(3)}
                disabled={!selectedDoctor}
              >
                Continue to Details
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold">Step 3: Appointment Details</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-700">
                Appointment Date
                <input
                  type="date"
                  className="input mt-1"
                  value={appointmentDate}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                />
              </label>
              <div>
                <p className="text-sm text-slate-700">Available Time Slots</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                        selectedSlot === slot
                          ? 'border-med-500 bg-med-50 text-med-700'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <label className="text-sm text-slate-700 sm:col-span-2">
                Reason for Visit
                <textarea
                  className="input mt-1 min-h-[90px]"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Briefly describe your concern"
                />
              </label>

              <label className="text-sm text-slate-700 sm:col-span-2">
                Upload Medical Record (PDF/JPG/PNG)
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input mt-1"
                  onChange={(event) => setRecordFile(event.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="flex justify-between">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowSummary((prev) => !prev)}
                disabled={!selectedDoctor || !appointmentDate || !selectedSlot || !reason.trim()}
              >
                {showSummary ? 'Hide Summary' : 'Review Summary'}
              </button>
            </div>

            {showSummary ? (
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="font-semibold">Confirmation Summary</p>
                <p className="mt-2"><span className="font-semibold">Doctor:</span> {selectedDoctor?.fullName}</p>
                <p><span className="font-semibold">Department:</span> {selectedDepartment}</p>
                <p><span className="font-semibold">Date:</span> {appointmentDate}</p>
                <p><span className="font-semibold">Time:</span> {selectedSlot}</p>
                <p><span className="font-semibold">Reason:</span> {reason}</p>
                <p><span className="font-semibold">File:</span> {recordFile?.name || 'No file uploaded'}</p>

                {loading.appointment ? (
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-med-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Uploading medical file... {uploadProgress}%</p>
                  </div>
                ) : null}

              </article>
            ) : null}

            <div className="flex justify-end">
              <button type="button" className="btn-primary" onClick={handleConfirm} disabled={loading.appointment || !showSummary}>
                {loading.appointment ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {confirmedAppointment ? (
        <section className="card border border-emerald-200 bg-emerald-50">
          <p className="text-sm font-semibold text-emerald-700">✅ Appointment Confirmed Successfully</p>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <p><span className="font-semibold">Appointment ID:</span> {confirmedAppointment.appointmentId}</p>
            <p><span className="font-semibold">Doctor:</span> {confirmedAppointment.doctorName}</p>
            <p><span className="font-semibold">Department:</span> {confirmedAppointment.department}</p>
            <p><span className="font-semibold">Date & Slot:</span> {confirmedAppointment.date} • {confirmedAppointment.slot}</p>
            <p className="sm:col-span-2"><span className="font-semibold">Reason:</span> {confirmedAppointment.reason}</p>
            <p className="sm:col-span-2"><span className="font-semibold">Attachment:</span> {confirmedAppointment.attachment}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AppointmentsPage;
