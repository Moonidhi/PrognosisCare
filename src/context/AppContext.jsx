import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { departmentList as baseDepartments, doctors as baseDoctors } from '../services/mockDoctorsData';
import { sampleAppointments } from '../services/sampleAppointmentsData';
import {
  createBooking,
  processMockPayment,
  uploadReportMock,
} from '../services/mockApi';
import {
  fetchGeminiRecommendations,
  isLikelyHealthSymptomInput,
  isSimpleLowRiskSymptomInput,
} from '../services/geminiService';
import { fetchPrediction } from '../services/predictionService';

const AppContext = createContext(null);

// Keys (prefixes)
const PATIENT_PROFILE_KEY = 'pc_patient_profile';
const APPOINTMENTS_KEY = 'pc_appointments';
const MEDICAL_RECORDS_KEY = 'pc_medical_records';

// Global keys (not user-specific)
const DOCTORS_KEY = 'pc_doctors';
const DEPARTMENTS_KEY = 'pc_departments';
const DOCTORS_DATA_VERSION_KEY = 'pc_doctors_data_version';
const DOCTORS_DATA_VERSION = '2026-02-14-image-refresh-v1';
const APPOINTMENTS_DATA_VERSION_KEY = 'pc_appointments_data_version';
const APPOINTMENTS_DATA_VERSION = '2026-02-15-empty-v1';

const emptyPatientProfile = {
  id: 'PAT-1001',
  name: '',
  selectedHospitalId: '',
  dob: '',
  bloodGroup: '',
  gender: '',
  emergencyContact: '',
  lastCheckupDate: '',
  riskLevel: 'low',
  bp: '',
};

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // no-op
  }
}

function getStoredList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function inferRiskLevelFromBp(bp) {
  if (!bp?.includes('/')) return 'low';
  const [systolicText, diastolicText] = bp.split('/');
  const systolic = Number(systolicText);
  const diastolic = Number(diastolicText);

  if (Number.isNaN(systolic) || Number.isNaN(diastolic)) return 'low';
  if (systolic >= 140 || diastolic >= 90) return 'high';
  if (systolic >= 130 || diastolic >= 85) return 'medium';
  return 'low';
}

function parseJsonIfPossible(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  let cleaned = trimmed;
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
}

function normalizePriority(priority) {
  const level = String(priority || '').toLowerCase();
  if (level === 'high' || level === 'medium' || level === 'low') return level;
  return 'medium';
}

function normalizeTestsList(rawTests) {
  let tests = rawTests;

  if (typeof tests === 'string') {
    const parsed = parseJsonIfPossible(tests);
    tests = parsed ?? [];
  }

  if (!Array.isArray(tests)) return [];

  return tests
    .map((test, index) => ({
      id: test?.id || `test-${Date.now()}-${index + 1}`,
      name: test?.name || 'Recommended test',
      reason: test?.reason || 'Recommended based on reported symptoms.',
      priority: normalizePriority(test?.priority),
      cost: Number.isFinite(Number(test?.cost)) ? Number(test.cost) : 1200,
    }))
    .filter((test) => Boolean(test.name));
}

function normalizeAiResult(rawData) {
  const fallback = {
    summary: 'AI analysis completed. Please review the recommendations below.',
    tests: [],
    riskLevel: 'Low',
    confidenceScore: 0,
    recommendedDepartment: 'General Medicine',
    reasoning: [],
    isHealthRelated: true,
  };

  if (!rawData) return fallback;

  let data = rawData;
  if (typeof data === 'string') {
    const parsed = parseJsonIfPossible(data);
    data = parsed || { ...fallback, summary: data.slice(0, 300) };
  }

  if (typeof data?.summary === 'string') {
    const summaryParsed = parseJsonIfPossible(data.summary);
    if (summaryParsed && typeof summaryParsed === 'object') {
      data = {
        ...summaryParsed,
        ...data,
        summary: summaryParsed.summary || data.summary,
      };
    }
  }

  const candidate = data?.response && typeof data.response === 'object' ? data.response : data;

  const tests = normalizeTestsList(candidate?.tests ?? candidate?.recommendedTests ?? candidate?.recommended_tests);
  const summary = typeof candidate?.summary === 'string'
    ? candidate.summary
    : typeof candidate?.triageSummary === 'string'
      ? candidate.triageSummary
      : fallback.summary;

  return {
    ...fallback,
    ...candidate,
    summary,
    tests,
    riskLevel: candidate?.riskLevel || fallback.riskLevel,
    confidenceScore: Number.isFinite(Number(candidate?.confidenceScore)) ? Number(candidate.confidenceScore) : fallback.confidenceScore,
    recommendedDepartment: candidate?.recommendedDepartment || fallback.recommendedDepartment,
    reasoning: Array.isArray(candidate?.reasoning) ? candidate.reasoning : fallback.reasoning,
  };
}

function hasRecommendedTests(data) {
  return Array.isArray(data?.tests) && data.tests.length > 0;
}

async function getServiceBackedRecommendations(symptomsText) {
  const backendResponse = await fetchPrediction(symptomsText);
  return normalizeAiResult({
    summary: backendResponse.summary,
    tests: backendResponse.tests,
    recommendedDepartment: backendResponse.specialty,
    riskLevel: backendResponse.riskLevel,
  });
}

const hospitals = [
  {
    id: 'hosp-2',
    name: 'Fortis Hospital',
    locations: ['Main Tower', 'Diagnostics Wing'],
    address: '88 Health Avenue, Metro City',
    description: 'Contracted tertiary partner hospital with advanced specialty care and diagnostics.',
    specialties: ['Pulmonology', 'Endocrinology', 'Oncology', 'Cardiology'],
    specialistUnits: [
      'Pulmonary Critical Care Unit',
      'Advanced Cardiac Services',
      'Comprehensive Oncology Team',
      'Neurology & Stroke Unit',
    ],
    facilities: [
      '24/7 Emergency Response',
      'Advanced Imaging Suite',
      'Integrated ICU Support',
      'Multispeciality OPD',
    ],
    accreditation: 'NABH Accredited',
    rating: 4.8,
    emergencySupport: '24/7 Emergency & ICU',
    insuranceAvailable: true,
    serviceFee: 199,
    taxRate: 0.12,
  },
  {
    id: 'hosp-1',
    name: 'CityCare Multi-Speciality Hospital',
    locations: ['Downtown Center', 'North Campus', 'East Wing Diagnostics'],
    address: '12 Heartline Ave, MedCity',
    description: 'Contracted multi-speciality center with integrated diagnostics and specialist OPDs.',
    specialties: ['General Medicine', 'Cardiology', 'Neurology', 'Pathology'],
    specialistUnits: ['Cardiac Unit', 'Neuro Unit', 'Comprehensive Diagnostics'],
    facilities: ['MRI & CT', 'Operation Theatres', 'Cath Lab', 'Advanced Lab'],
    accreditation: 'NABH Accredited',
    rating: 4.7,
    emergencySupport: '24/7 Emergency & ICU',
    insuranceAvailable: true,
    serviceFee: 199,
    taxRate: 0.12,
  },
  {
    id: 'hosp-3',
    name: 'Max Hospital',
    locations: ['Central Campus', 'Specialty Block'],
    address: '44 Clinical Street, Health District',
    description: 'Contracted high-volume specialty hospital for critical and chronic care pathways.',
    specialties: ['Oncology', 'Pulmonology', 'Endocrinology', 'ENT'],
    specialistUnits: ['Oncology Daycare', 'Pulmonary Rehab', 'Cardiac Risk Clinic'],
    facilities: ['Advanced OT', 'Daycare Suites', 'Comprehensive Lab Services'],
    accreditation: 'NABH Accredited',
    rating: 4.6,
    emergencySupport: '24/7 Emergency',
    insuranceAvailable: true,
    serviceFee: 219,
    taxRate: 0.12,
  },
];

// Initial state template
const baseInitialState = {
  patient: emptyPatientProfile,
  profileCompleted: false,
  patientSymptoms: '',
  recommendedTests: [],
  recommendationSummary: '',
  doctors: baseDoctors,
  departments: baseDepartments,
  selectedHospital: hospitals[0],
  draftBooking: null,
  latestBooking: null,
  appointments: [],
  medicalRecords: [],
  paymentHistory: [],
  reports: [],
  notifications: [],
  aiRiskLevel: 'Low',
  aiConfidenceScore: 0,
  aiRecommendedDepartment: 'General Medicine',
  aiReasoning: [],
};

function buildBillItems(tests, serviceFee, taxRate, insuranceEnabled) {
  const rows = tests.map((test) => {
    const tax = Math.round(test.cost * taxRate);
    const discounted = insuranceEnabled ? Math.round(test.cost * 0.8) : test.cost;
    return {
      name: test.name,
      basePrice: test.cost,
      discountedPrice: discounted,
      serviceFee,
      tax,
      total: discounted + serviceFee + tax,
    };
  });

  const subtotal = rows.reduce((sum, row) => sum + row.discountedPrice, 0);
  const fees = rows.reduce((sum, row) => sum + row.serviceFee, 0);
  const taxes = rows.reduce((sum, row) => sum + row.tax, 0);

  return {
    rows,
    subtotal,
    fees,
    taxes,
    total: subtotal + fees + taxes,
  };
}

function composeDraftBooking(state, { location, slot, insuranceEnabled }) {
  const bill = buildBillItems(
    state.recommendedTests,
    state.selectedHospital.serviceFee,
    state.selectedHospital.taxRate,
    insuranceEnabled
  );

  return {
    tests: state.recommendedTests,
    hospital: state.selectedHospital,
    location,
    slot,
    insuranceEnabled,
    bill,
  };
}

export function AppProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, setState] = useState(baseInitialState);
  const [loading, setLoading] = useState({
    recommendations: false,
    booking: false,
    appointment: false,
    payment: false,
    reportUpload: false,
  });
  const [paymentError, setPaymentError] = useState('');

  // Hydrate state from LocalStorage based on currentUser
  useEffect(() => {
    if (!currentUser) {
      // Reset to base state if no user
      setState(baseInitialState);
      return;
    }

    const userId = currentUser.id;
    const userProfileKey = `${PATIENT_PROFILE_KEY}_${userId}`;
    const userAppointmentsKey = `${APPOINTMENTS_KEY}_${userId}`;
    const userRecordsKey = `${MEDICAL_RECORDS_KEY}_${userId}`;

    // Load global data first
    const storedDoctors = getStoredList(DOCTORS_KEY);
    const storedDepartments = getStoredList(DEPARTMENTS_KEY);
    const storedDoctorsDataVersion = getStoredValue(DOCTORS_DATA_VERSION_KEY);

    // Seed global doctors if version mismatch
    const shouldRefreshDoctorSeed = storedDoctorsDataVersion !== DOCTORS_DATA_VERSION;
    if (shouldRefreshDoctorSeed) {
      setStoredValue(DOCTORS_KEY, JSON.stringify(baseDoctors));
      setStoredValue(DEPARTMENTS_KEY, JSON.stringify(baseDepartments));
      setStoredValue(DOCTORS_DATA_VERSION_KEY, DOCTORS_DATA_VERSION);
    }

    // Load User Data
    const storedProfile = getStoredList(userProfileKey);
    // Wait, getStoredList returns [], but getStoredValue returns string/null.
    // Profile is object. Let's fix manual parsing here for profile.
    let userProfile = null;
    try {
      const raw = localStorage.getItem(userProfileKey);
      if (raw) userProfile = JSON.parse(raw);
    } catch { }

    const userAppointments = getStoredList(userAppointmentsKey);
    const userRecords = getStoredList(userRecordsKey);

    const initialPatient = userProfile
      ? { ...emptyPatientProfile, ...userProfile, id: userId, name: userProfile.name || currentUser.name || '' }
      : { ...emptyPatientProfile, id: userId, name: currentUser.name || '' };

    const selectedHospital = hospitals.find((h) => h.id === initialPatient.selectedHospitalId) || hospitals[0];

    setState(prev => ({
      ...prev,
      patient: initialPatient,
      profileCompleted: Boolean(initialPatient.name && initialPatient.dob),
      appointments: userAppointments,
      medicalRecords: userRecords,
      doctors: shouldRefreshDoctorSeed ? baseDoctors : (storedDoctors.length ? storedDoctors : baseDoctors),
      departments: shouldRefreshDoctorSeed ? baseDepartments : (storedDepartments.length ? storedDepartments : baseDepartments),
      selectedHospital,
      // Reset transactional state
      draftBooking: null,
      latestBooking: null,
      paymentHistory: [],
      reports: [],
      notifications: [],
    }));

  }, [currentUser]); // Depend only on currentUser

  // ─── Firestore Sync (Filtered by User) ───
  useEffect(() => {
    if (!db || !currentUser) return;

    // Filter appointments for THIS patient only
    const q = query(collection(db, 'appointments'), where('patient_id', '==', currentUser.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveAppointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setState((prev) => {
        return {
          ...prev,
          appointments: liveAppointments,
        };
      });
    }, (error) => {
      console.error("Firestore sync error:", error);
    });

    return () => unsubscribe();
  }, [currentUser]); // Re-subscribe when user changes

  // Helper to get user-specific key
  const getUserKey = (baseKey) => {
    return currentUser ? `${baseKey}_${currentUser.id}` : baseKey;
  };

  const updatePatientProfile = (profileInput) => {
    const riskLevel = inferRiskLevelFromBp(profileInput.bp);
    const selectedHospital = hospitals.find((hospital) => hospital.id === profileInput.selectedHospitalId) || hospitals[0];
    const nextPatient = {
      ...state.patient,
      ...profileInput,
      riskLevel,
      selectedHospitalId: selectedHospital.id,
    };

    if (currentUser) {
      setStoredValue(getUserKey(PATIENT_PROFILE_KEY), JSON.stringify(nextPatient));
    }

    setState((prev) => ({
      ...prev,
      patient: nextPatient,
      selectedHospital,
      profileCompleted: true,
    }));
  };

  const setPatientSelectedHospital = (hospitalId) => {
    const selectedHospital = hospitals.find((hospital) => hospital.id === hospitalId) || hospitals[0];

    setState((prev) => {
      const nextPatient = {
        ...prev.patient,
        selectedHospitalId: selectedHospital.id,
      };

      if (currentUser) {
        setStoredValue(getUserKey(PATIENT_PROFILE_KEY), JSON.stringify(nextPatient));
      }

      return {
        ...prev,
        patient: nextPatient,
        selectedHospital,
      };
    });
  };

  const pushNotification = (message) => {
    setState((prev) => ({
      ...prev,
      notifications: [{ id: Date.now(), message }, ...prev.notifications].slice(0, 5),
    }));
  };

  const persistDoctors = (doctorsList) => {
    setStoredValue(DOCTORS_KEY, JSON.stringify(doctorsList));
  };

  const persistDepartments = (departmentsList) => {
    setStoredValue(DEPARTMENTS_KEY, JSON.stringify(departmentsList));
  };

  const persistAppointments = (appointments) => {
    if (currentUser) {
      setStoredValue(getUserKey(APPOINTMENTS_KEY), JSON.stringify(appointments));
    }
  };

  const persistMedicalRecords = (records) => {
    if (currentUser) {
      setStoredValue(getUserKey(MEDICAL_RECORDS_KEY), JSON.stringify(records));
    }
  };

  const addMedicalRecord = async ({ file, recordType, notes, appointmentId, doctorName }) => {
    const previewUrl = await readFileAsDataURL(file);
    const newRecord = {
      id: `MR-${Date.now().toString().slice(-8)}`,
      fileName: file?.name || 'record',
      mimeType: file?.type || 'application/octet-stream',
      previewUrl,
      recordType,
      notes: notes || '',
      linkedAppointmentId: appointmentId || null,
      linkedDoctorName: doctorName || '',
      uploadDate: new Date().toISOString(),
      source: 'user',
    };

    setState((prev) => {
      const nextRecords = [newRecord, ...prev.medicalRecords];
      persistMedicalRecords(nextRecords);
      return {
        ...prev,
        medicalRecords: nextRecords,
      };
    });

    return newRecord;
  };

  const addDoctor = (doctorInput, hospitalId, hospitalName) => {
    const doctor = {
      id: `doctor-${Date.now().toString().slice(-8)}`,
      fullName: doctorInput.fullName,
      gender: doctorInput.gender,
      department: doctorInput.department,
      specialization: doctorInput.specialization,
      experienceYears: Number(doctorInput.experienceYears),
      educationShort: doctorInput.educationShort,
      educationHistory: [
        { degree: 'MBBS', institution: doctorInput.mbbsInstitution, year: doctorInput.mbbsYear },
        { degree: doctorInput.advancedDegree, institution: doctorInput.advancedInstitution, year: doctorInput.advancedYear },
      ],
      consultationFee: Number(doctorInput.consultationFee),
      languages: doctorInput.languages.split(',').map((item) => item.trim()).filter(Boolean),
      profileImage: doctorInput.profileImage,
      availabilityStatus: 'Available',
      weeklyAvailability: doctorInput.weeklyAvailability,
      availableTimeSlots: doctorInput.availableTimeSlots,
      professionalBio: doctorInput.professionalBio,
      workTimeline: [{ period: 'Current', role: `Consultant, ${hospitalName}` }],
      hospitalAffiliation: hospitalName,
      hospitalId,
      certifications: ['Medical Council Registered'],
      publications: ['Clinical profile available on request'],
      patientReviews: [],
    };

    setState((prev) => {
      const nextDoctors = [doctor, ...prev.doctors];
      persistDoctors(nextDoctors);
      return {
        ...prev,
        doctors: nextDoctors,
      };
    });

    pushNotification(`Doctor ${doctor.fullName} added successfully.`);
    return doctor;
  };

  const updateDoctor = (doctorId, patch) => {
    setState((prev) => {
      const nextDoctors = prev.doctors.map((doctor) => (doctor.id === doctorId ? { ...doctor, ...patch } : doctor));
      persistDoctors(nextDoctors);
      return {
        ...prev,
        doctors: nextDoctors,
      };
    });
  };

  const removeDoctor = (doctorId) => {
    setState((prev) => {
      const nextDoctors = prev.doctors.filter((doctor) => doctor.id !== doctorId);
      persistDoctors(nextDoctors);
      return {
        ...prev,
        doctors: nextDoctors,
      };
    });
  };

  const addDepartment = (departmentName) => {
    const clean = departmentName.trim();
    if (!clean) return;
    setState((prev) => {
      if (prev.departments.includes(clean)) return prev;
      const nextDepartments = [...prev.departments, clean];
      persistDepartments(nextDepartments);
      return {
        ...prev,
        departments: nextDepartments,
      };
    });
  };

  const editDepartment = (oldName, newName) => {
    const clean = newName.trim();
    if (!clean) return;
    setState((prev) => {
      const nextDepartments = prev.departments.map((department) => (department === oldName ? clean : department));
      const nextDoctors = prev.doctors.map((doctor) =>
        doctor.department === oldName ? { ...doctor, department: clean } : doctor
      );
      persistDepartments(nextDepartments);
      persistDoctors(nextDoctors);
      return {
        ...prev,
        departments: nextDepartments,
        doctors: nextDoctors,
      };
    });
  };

  const deleteDepartment = (departmentName) => {
    setState((prev) => {
      const nextDepartments = prev.departments.filter((department) => department !== departmentName);
      persistDepartments(nextDepartments);
      return {
        ...prev,
        departments: nextDepartments,
      };
    });
  };

  const deleteMedicalRecord = (recordId) => {
    setState((prev) => {
      const nextRecords = prev.medicalRecords.filter((record) => record.id !== recordId);
      persistMedicalRecords(nextRecords);
      return {
        ...prev,
        medicalRecords: nextRecords,
      };
    });
  };

  const addAppointment = async ({ doctor, department, date, time, reason, file, recordType }) => {
    setLoading((prev) => ({ ...prev, appointment: true }));

    const appointmentId = `APT-${Date.now().toString().slice(-8)}`;
    const filePreview = await readFileAsDataURL(file);
    const appointmentHospital =
      hospitals.find((hospital) => hospital.id === doctor.hospitalId) || state.selectedHospital;
    const patientDisplayName = state.patient.name?.trim() || state.patient.id || 'Patient';

    const appointment = {
      id: appointmentId,
      patient_id: state.patient.id, // Ensure this uses the current user ID from state
      patientName: patientDisplayName,
      doctor_id: doctor.id,
      hospital_id: doctor.hospitalId || 'hosp-1',
      hospitalName: doctor.hospitalName || appointmentHospital?.name || '',
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      department,
      date,
      time,
      reason,
      consultationFee: doctor.consultationFee,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
      uploadedMedicalFile: file
        ? {
          fileName: file.name,
          mimeType: file.type,
          previewUrl: filePreview,
          uploadedAt: new Date().toISOString(),
        }
        : null,
    };

    if (db) {
      // Write to Firestore
      try {
        await setDoc(doc(db, 'appointments', appointment.id), appointment);
        // State update handled by listener (which is now filtered)
      } catch (e) {
        console.error("Error adding appointment to DB:", e);
      }
    } else {
      // Fallback: Local Storage (Filtered Key)
      setState((prev) => {
        const nextAppointments = [appointment, ...prev.appointments];
        persistAppointments(nextAppointments);
        return {
          ...prev,
          appointments: nextAppointments,
        };
      });
    }

    if (file) {
      await addMedicalRecord({
        file,
        recordType: recordType || 'Appointment Attachment',
        notes: reason,
        appointmentId: appointment.id,
        doctorName: doctor.fullName,
      });
    }

    pushNotification(`Appointment booked with ${doctor.fullName}.`);
    setLoading((prev) => ({ ...prev, appointment: false }));
    return appointment;
  };

  const cancelAppointment = (appointmentId) => {
    if (db) {
      deleteDoc(doc(db, 'appointments', appointmentId)).catch(console.error);
    } else {
      setState((prev) => {
        const nextAppointments = prev.appointments.filter((appointment) =>
          appointment.id !== appointmentId
        );
        persistAppointments(nextAppointments);
        return {
          ...prev,
          appointments: nextAppointments,
        };
      });
    }
    pushNotification('Appointment cancelled.');
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    if (db) {
      updateDoc(doc(db, 'appointments', appointmentId), { status }).catch(console.error);
    } else {
      setState((prev) => {
        const nextAppointments = prev.appointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status } : appointment
        );
        persistAppointments(nextAppointments);
        return {
          ...prev,
          appointments: nextAppointments,
        };
      });
    }
    pushNotification(`Appointment marked as ${status}.`);
  };

  const loadRecommendations = async (symptomsText) => {
    const cleanSymptoms = symptomsText?.trim();
    if (!cleanSymptoms) {
      setState((prev) => ({
        ...prev,
        patientSymptoms: '',
        recommendedTests: [],
        recommendationSummary: '',
      }));
      return;
    }

    if (!isLikelyHealthSymptomInput(cleanSymptoms)) {
      setState((prev) => ({
        ...prev,
        patientSymptoms: cleanSymptoms,
        recommendedTests: [],
        recommendationSummary: 'Please describe your health symptoms (for example: fever, cough, chest pain) so I can help.',
      }));
      return;
    }

    if (isSimpleLowRiskSymptomInput(cleanSymptoms)) {
      setState((prev) => ({
        ...prev,
        patientSymptoms: cleanSymptoms,
        recommendedTests: [],
        recommendationSummary:
          'This sounds like a mild symptom pattern. Start with rest, hydration, posture correction, light stretching, and a simple pain-relief approach if suitable for you. If symptoms worsen, persist beyond a few days, or any red-flag signs appear, consult a doctor promptly.',
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, recommendations: true }));

    let normalized;
    try {
      normalized = await getServiceBackedRecommendations(cleanSymptoms);

      if (!hasRecommendedTests(normalized)) {
        const aiResponse = await fetchGeminiRecommendations(cleanSymptoms);
        normalized = normalizeAiResult(aiResponse);

        if (normalized?.isHealthRelated === false) {
          normalized = {
            ...normalized,
            summary: 'Please describe your health symptoms (for example: fever, cough, chest pain) so I can help.',
            tests: [],
          };
        }
      }
    } catch (backendErr) {
      console.warn('Service recommendation failed, trying AI fallback:', backendErr);
      try {
        const aiResponse = await fetchGeminiRecommendations(cleanSymptoms);
        normalized = normalizeAiResult(aiResponse);

        if (!hasRecommendedTests(normalized)) {
          try {
            const backendNormalized = await getServiceBackedRecommendations(cleanSymptoms);
            if (hasRecommendedTests(backendNormalized)) {
              normalized = {
                ...normalized,
                tests: backendNormalized.tests,
                recommendedDepartment: normalized.recommendedDepartment || backendNormalized.recommendedDepartment,
              };
            }
          } catch {
            // keep AI-only response if backend stays unavailable
          }
        }
      } catch (aiErr) {
        console.warn('AI fallback also failed:', aiErr);
        normalized = {
          summary: 'Unable to generate recommendations right now. Please try again in a moment.',
          tests: [],
          riskLevel: 'Low',
          confidenceScore: 0,
          recommendedDepartment: 'General Medicine',
          reasoning: [],
        };
      }
    }

    setState((prev) => ({
      ...prev,
      patientSymptoms: cleanSymptoms,
      recommendedTests: normalized.tests,
      recommendationSummary: normalized.summary,
      aiRiskLevel: normalized.riskLevel || 'Low',
      aiConfidenceScore: normalized.confidenceScore || 0,
      aiRecommendedDepartment: normalized.recommendedDepartment || 'General Medicine',
      aiReasoning: normalized.reasoning || [],
    }));
    setLoading((prev) => ({ ...prev, recommendations: false }));
  };

  const analyzeWithDocs = async (symptomsText, file) => {
    const cleanSymptoms = symptomsText?.trim();

    if (!cleanSymptoms) {
      setState((prev) => ({
        ...prev,
        patientSymptoms: '',
        recommendedTests: [],
        recommendationSummary: 'Please enter health symptoms before running triage.',
      }));
      return;
    }

    if (!isLikelyHealthSymptomInput(cleanSymptoms)) {
      setState((prev) => ({
        ...prev,
        patientSymptoms: cleanSymptoms,
        recommendedTests: [],
        recommendationSummary: 'Please enter valid health-related symptoms (for example: fever, cough, chest pain).',
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, recommendations: true }));
    try {
      let fileBase64 = null;
      let mimeType = null;

      if (file) {
        fileBase64 = await readFileAsDataURL(file);
        mimeType = file.type;
      }

      const data = await fetchGeminiRecommendations(symptomsText, fileBase64, mimeType);
      let normalized = normalizeAiResult(data);

      if (cleanSymptoms && !hasRecommendedTests(normalized)) {
        try {
          const backendNormalized = await getServiceBackedRecommendations(cleanSymptoms);
          if (hasRecommendedTests(backendNormalized)) {
            normalized = {
              ...normalized,
              tests: backendNormalized.tests,
              recommendedDepartment: normalized.recommendedDepartment || backendNormalized.recommendedDepartment,
            };
          }
        } catch {
          // keep AI response only when backend isn't available
        }
      }

      setState((prev) => ({
        ...prev,
        patientSymptoms: cleanSymptoms || symptomsText,
        recommendedTests: normalized.tests,
        recommendationSummary: normalized.summary,
        aiRiskLevel: normalized.riskLevel || 'Low',
        aiConfidenceScore: normalized.confidenceScore || 0,
        aiRecommendedDepartment: normalized.recommendedDepartment || 'General Medicine',
        aiReasoning: normalized.reasoning || [],
      }));
    } catch (error) {
      console.error('AI Analysis failed:', error);
      pushNotification('AI Analysis failed. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, recommendations: false }));
    }
  };

  const saveDraftBooking = ({ location, slot, insuranceEnabled }) => {
    const draft = composeDraftBooking(state, { location, slot, insuranceEnabled });

    setState((prev) => ({
      ...prev,
      draftBooking: draft,
    }));

    return draft;
  };

  const confirmBooking = async (draftBooking) => {
    const bookingDraft = draftBooking || state.draftBooking;
    if (!bookingDraft) return null;
    setLoading((prev) => ({ ...prev, booking: true }));

    const booking = await createBooking({
      patient: state.patient,
      ...bookingDraft,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
    });

    setState((prev) => ({ ...prev, latestBooking: booking }));
    setLoading((prev) => ({ ...prev, booking: false }));
    return booking;
  };

  const payForBooking = async ({ method, details }) => {
    if (!state.latestBooking) return { ok: false, error: 'Booking missing.' };
    setLoading((prev) => ({ ...prev, payment: true }));
    setPaymentError('');

    const response = await processMockPayment({
      bookingId: state.latestBooking.bookingId,
      amount: state.latestBooking.bill.total,
      method,
      details,
    });

    if (!response.ok) {
      setPaymentError(response.error);
      setLoading((prev) => ({ ...prev, payment: false }));
      return response;
    }

    setState((prev) => {
      const paidBooking = {
        ...prev.latestBooking,
        paymentStatus: 'paid',
        payment: response,
      };

      return {
        ...prev,
        latestBooking: paidBooking,
        paymentHistory: [
          {
            id: response.paymentId,
            invoiceId: response.invoiceId,
            amount: response.amount,
            method: response.method,
            date: response.paidAt,
            bookingId: response.bookingId,
          },
          ...prev.paymentHistory,
        ],
      };
    });

    pushNotification('Your lab test is scheduled. Payment confirmed.');
    setLoading((prev) => ({ ...prev, payment: false }));
    return response;
  };

  const markTestCompleted = () => {
    setState((prev) => {
      if (!prev.latestBooking) return prev;
      return {
        ...prev,
        latestBooking: {
          ...prev.latestBooking,
          status: 'completed',
        },
      };
    });
    pushNotification('Your hospital marked the test as completed.');
  };

  const uploadReport = async (fileName) => {
    if (!state.latestBooking) return null;
    setLoading((prev) => ({ ...prev, reportUpload: true }));

    const report = await uploadReportMock({
      bookingId: state.latestBooking.bookingId,
      fileName,
    });

    setState((prev) => {
      const nextMedicalRecords = [
        {
          id: report.reportId,
          fileName: report.fileName,
          mimeType: 'application/pdf',
          previewUrl: '',
          recordType: 'Lab Report',
          notes: prev.latestBooking.tests.map((test) => test.name).join(', '),
          linkedAppointmentId: null,
          linkedDoctorName: '',
          uploadDate: report.uploadedAt,
          source: 'hospital',
        },
        ...prev.medicalRecords,
      ];

      persistMedicalRecords(nextMedicalRecords);

      return {
        ...prev,
        reports: [
          {
            ...report,
            hospitalName: prev.latestBooking.hospital.name,
            testNames: prev.latestBooking.tests.map((test) => test.name),
          },
          ...prev.reports,
        ],
        medicalRecords: nextMedicalRecords,
        latestBooking: {
          ...prev.latestBooking,
          reportStatus: 'Available',
        },
      };
    });

    setLoading((prev) => ({ ...prev, reportUpload: false }));
    pushNotification('New lab report is now available in Medical Records.');
    return report;
  };

  const value = useMemo(
    () => ({
      state,
      hospitals,
      loading,
      paymentError,
      updatePatientProfile,
      setPatientSelectedHospital,
      addDoctor,
      updateDoctor,
      removeDoctor,
      addDepartment,
      editDepartment,
      deleteDepartment,
      addAppointment,
      cancelAppointment,
      updateAppointmentStatus,
      addMedicalRecord,
      deleteMedicalRecord,
      pushNotification,
      loadRecommendations,
      analyzeWithDocs,
      saveDraftBooking,
      confirmBooking,
      payForBooking,
      markTestCompleted,
      uploadReport,
    }),
    [state, loading, paymentError]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
