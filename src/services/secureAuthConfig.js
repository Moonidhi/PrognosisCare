// Centralized secure auth config for privileged account access.
// In production this should come from backend secrets, but for this mock
// app we support environment-based credentials with safe defaults.

export const secureSuperAdminCredentials = {
  email: import.meta.env.VITE_SUPER_ADMIN_EMAIL || '',
  password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD || '',
  name: import.meta.env.VITE_SUPER_ADMIN_NAME || 'Platform Owner',
};

export const hardcodedDoctors = [
  // Fortis Hospital (hosp-2)
  {
    email: 'dr.vikram@fortis.com',
    password: 'Password123!',
    name: 'Dr. Vikram Malhotra',
    doctorName: 'Dr. Vikram Malhotra',
    department: 'Cardiology',
    hospitalName: 'Fortis Hospital',
    hospitalId: 'hosp-2',
    role: 'doctor',
    doctorId: 'hosp-2-cardiology-1'
  },
  {
    email: 'dr.arjun@fortis.com',
    password: 'Password123!',
    name: 'Dr. Arjun Mehta',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Pulmonology',
    hospitalName: 'Fortis Hospital',
    hospitalId: 'hosp-2',
    role: 'doctor',
    doctorId: 'hosp-2-pulmonology-1'
  },
  // CityCare (hosp-1)
  {
    email: 'dr.amit@citycare.com',
    password: 'Password123!',
    name: 'Dr. Amit Verma',
    doctorName: 'Dr. Amit Verma',
    department: 'General Medicine',
    hospitalName: 'CityCare Multi-Speciality Hospital',
    hospitalId: 'hosp-1',
    role: 'doctor',
    doctorId: 'hosp-1-general-medicine-1'
  },
  {
    email: 'dr.rajat@citycare.com',
    password: 'Password123!',
    name: 'Dr. Rajat Khanna',
    doctorName: 'Dr. Rajat Khanna',
    department: 'Neurology',
    hospitalName: 'CityCare Multi-Speciality Hospital',
    hospitalId: 'hosp-1',
    role: 'doctor',
    doctorId: 'hosp-1-neurology-1'
  },
  // Max Hospital (hosp-3)
  {
    email: 'dr.rajiv@max.com',
    password: 'Password123!',
    name: 'Dr. Rajiv Kapoor',
    doctorName: 'Dr. Rajiv Kapoor',
    department: 'Oncology',
    hospitalName: 'Max Hospital',
    hospitalId: 'hosp-3',
    role: 'doctor',
    doctorId: 'hosp-3-oncology-1'
  },
  {
    email: 'dr.mohit@max.com',
    password: 'Password123!',
    name: 'Dr. Mohit Agarwal',
    doctorName: 'Dr. Mohit Agarwal',
    department: 'Endocrinology',
    hospitalName: 'Max Hospital',
    hospitalId: 'hosp-3',
    role: 'doctor',
    doctorId: 'hosp-3-endocrinology-1'
  }
];
