import { doctors } from './mockDoctorsData';

const DOCTOR_DATA_KEY = 'pc_doctor_dashboard_data';
const DOCTOR_PASSWORD = 'Doctor@123';

const doctorSeed = doctors.slice(0, 6).map((doctor, index) => ({
  doctorId: doctor.id,
  email: `doctor${index + 1}@prognosiscare.com`,
  password: DOCTOR_PASSWORD,
}));

function readStore() {
  try {
    const raw = localStorage.getItem(DOCTOR_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStore(data) {
  localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(data));
}

function buildSeedData() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const dayAfter = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  // Use the specific IDs from our hardcoded set
  const drVikramId = 'hosp-2-cardiology-1'; // Fortis Cardio
  const drArjunId = 'hosp-2-pulmonology-1'; // Fortis Pulmo
  const drAmitId = 'hosp-1-general-medicine-1'; // CityCare GenMed

  // Fallback to first available if not found (though they should exist)
  const firstDoctor = doctors.find(d => d.id === drVikramId) || doctors[0];
  const secondDoctor = doctors.find(d => d.id === drArjunId) || doctors[1];
  const thirdDoctor = doctors.find(d => d.id === drAmitId) || doctors[2];

  const patients = [
    {
      id: 'PT-3001',
      doctor_id: firstDoctor.id,
      fullName: 'Aarav Singh',
      age: 38,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98111 22334',
      email: 'aarav.singh@gmail.com',
      allergies: ['Penicillin'],
      chronicConditions: ['Hypertension'],
      aiSummary: 'Elevated BP trends over 3 months. Lifestyle and medication adherence needed.',
      medicalHistory: ['Hypertension (3 years)', 'Mild sleep apnea'],
      uploadedFiles: [
        {
          name: 'bp-trend-report.pdf',
          mimeType: 'application/pdf',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
      ],
    },
    {
      id: 'PT-3002',
      doctor_id: firstDoctor.id, // Vikram
      fullName: 'Meera Patil',
      age: 29,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+91 98999 22110',
      email: 'meera.patil@gmail.com',
      allergies: ['None'],
      chronicConditions: ['Hypothyroidism'],
      aiSummary: 'Symptoms suggest thyroid dosage re-evaluation and vitamin profile check.',
      medicalHistory: ['Hypothyroidism'],
      uploadedFiles: [
        {
          name: 'thyroid-panel.png',
          mimeType: 'image/png',
          fileUrl: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      id: 'PT-3003',
      doctor_id: secondDoctor.id, // Arjun
      fullName: 'Rohan Nair',
      age: 47,
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '+91 90000 44556',
      email: 'rohan.nair@gmail.com',
      allergies: ['None'],
      chronicConditions: ['Asthma'],
      aiSummary: 'Recurring asthma episodes. Bronchoscopy recommended.',
      medicalHistory: ['Asthma (5 years)'],
      uploadedFiles: [],
    },
    {
      id: 'PT-3004',
      doctor_id: thirdDoctor.id, // Amit
      fullName: 'Suresh Kumar',
      age: 55,
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '+91 90000 77889',
      email: 'suresh.kumar@gmail.com',
      allergies: ['Dust'],
      chronicConditions: ['Diabetes'],
      aiSummary: 'Blood sugar levels fluctuating. Diet review needed.',
      medicalHistory: ['Diabetes Type 2'],
      uploadedFiles: [],
    }
  ];

  const appointments = [
    {
      id: 'DAPT-9001',
      doctor_id: firstDoctor.id,
      patient_id: 'PT-3001',
      date: today,
      time: '09:30 AM',
      reason: 'High blood pressure follow-up',
      riskLevel: 'High',
      department: firstDoctor.department,
      status: 'Upcoming',
      consultationFee: firstDoctor.consultationFee,
      patientName: 'Aarav Singh', // Add patient name for simpler display
      createdAt: new Date().toISOString(),
    },
    {
      id: 'DAPT-9002',
      doctor_id: firstDoctor.id,
      patient_id: 'PT-3002',
      date: today,
      time: '11:15 AM',
      reason: 'Fatigue and thyroid review',
      riskLevel: 'Medium',
      department: firstDoctor.department,
      status: 'Upcoming',
      consultationFee: firstDoctor.consultationFee,
      patientName: 'Meera Patil',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'DAPT-9003',
      doctor_id: firstDoctor.id,
      patient_id: 'PT-3002',
      date: tomorrow,
      time: '02:00 PM',
      reason: 'Medication adjustment review',
      riskLevel: 'Low',
      department: firstDoctor.department,
      status: 'Upcoming',
      consultationFee: firstDoctor.consultationFee,
      patientName: 'Meera Patil',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'DAPT-9004',
      doctor_id: secondDoctor.id,
      patient_id: 'PT-3003',
      date: today, // Move to today for visibility
      time: '10:45 AM',
      reason: 'Breathing difficulty',
      riskLevel: 'Medium',
      department: secondDoctor.department,
      status: 'Upcoming',
      consultationFee: secondDoctor.consultationFee,
      patientName: 'Rohan Nair',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'DAPT-9005',
      doctor_id: thirdDoctor.id,
      patient_id: 'PT-3004',
      date: today,
      time: '04:00 PM',
      reason: 'General checkup',
      riskLevel: 'Low',
      department: thirdDoctor.department,
      status: 'Upcoming',
      consultationFee: thirdDoctor.consultationFee,
      patientName: 'Suresh Kumar',
      createdAt: new Date().toISOString(),
    }
  ];

  const reports = [
    {
      id: 'DLAB-7001',
      doctor_id: firstDoctor.id,
      patient_id: 'PT-3001',
      testType: 'CBC + Lipid Profile',
      uploadedDate: today,
      fileName: 'lab-report-cbc.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      status: 'Pending',
      remarks: '',
    },
    {
      id: 'DLAB-7002',
      doctor_id: firstDoctor.id,
      patient_id: 'PT-3002',
      testType: 'TSH & T3/T4 Panel',
      uploadedDate: tomorrow,
      fileName: 'thyroid-lab-report.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      status: 'Pending',
      remarks: '',
    },
    {
      id: 'DLAB-7003',
      doctor_id: secondDoctor.id,
      patient_id: 'PT-3003',
      testType: 'Spirometry Report',
      uploadedDate: today,
      fileName: 'spirometry.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      status: 'Pending',
      remarks: '',
    },
    {
      id: 'DLAB-7004',
      doctor_id: thirdDoctor.id,
      patient_id: 'PT-3004',
      testType: 'HbA1c Report',
      uploadedDate: today,
      fileName: 'hba1c-report.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      status: 'Pending',
      remarks: '',
    },
  ];

  const prescriptions = [];
  const doctorProfiles = {};

  return {
    patients,
    appointments,
    reports,
    prescriptions,
    doctorProfiles,
  };
}

export function getDoctorAuthAccounts() {
  return doctorSeed;
}

export function getDoctorDashboardStore() {
  const existing = readStore();
  if (existing) return existing;
  const seed = buildSeedData();
  writeStore(seed);
  return seed;
}

export function updateDoctorDashboardStore(patch) {
  const current = getDoctorDashboardStore();
  const next = {
    ...current,
    ...patch,
  };
  writeStore(next);
  return next;
}

export function getDoctorScopedData(doctorId) {
  const store = getDoctorDashboardStore();
  return {
    patients: store.patients.filter((patient) => patient.doctor_id === doctorId),
    appointments: store.appointments.filter((appointment) => appointment.doctor_id === doctorId),
    reports: store.reports.filter((report) => report.doctor_id === doctorId),
    prescriptions: store.prescriptions.filter((prescription) => prescription.doctor_id === doctorId),
    doctorProfiles: store.doctorProfiles,
  };
}

export function upsertDoctorProfile(doctorId, profilePatch) {
  const store = getDoctorDashboardStore();
  const nextProfiles = {
    ...store.doctorProfiles,
    [doctorId]: {
      ...(store.doctorProfiles[doctorId] || {}),
      ...profilePatch,
    },
  };
  updateDoctorDashboardStore({ doctorProfiles: nextProfiles });
  return nextProfiles[doctorId];
}

export function updateDoctorAppointment(appointmentId, patch) {
  const store = getDoctorDashboardStore();
  const nextAppointments = store.appointments.map((appointment) =>
    appointment.id === appointmentId ? { ...appointment, ...patch } : appointment
  );
  updateDoctorDashboardStore({ appointments: nextAppointments });
}

export function updateDoctorReport(reportId, patch) {
  const store = getDoctorDashboardStore();
  const nextReports = store.reports.map((report) => (report.id === reportId ? { ...report, ...patch } : report));
  updateDoctorDashboardStore({ reports: nextReports });
}

export function saveDoctorPrescription(payload) {
  const store = getDoctorDashboardStore();
  const prescription = {
    id: `PR-${Date.now().toString().slice(-8)}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  const nextPrescriptions = [prescription, ...store.prescriptions];
  updateDoctorDashboardStore({ prescriptions: nextPrescriptions });
  return prescription;
}
