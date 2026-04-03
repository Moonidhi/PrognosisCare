import { contractDepartments, contractDoctors } from './contractHospitalData';

export const departments = contractDepartments;
export const departmentList = departments;

export function slugifyDepartment(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const doctors = contractDoctors;

export function getDoctorsByDepartment(departmentName) {
  return doctors.filter((doctor) => doctor.department === departmentName);
}

export function getDoctorById(doctorId) {
  return doctors.find((doctor) => doctor.id === doctorId);
}

export function getDepartmentNameFromSlug(slug) {
  return departments.find((name) => slugifyDepartment(name) === slug);
}
