import { doctors } from './mockDoctorsData';

export const quickActions = [
  {
    id: 'ai-assistant',
    title: 'Talk to AI Assistant',
    description: 'Get symptom guidance and triage support instantly.',
    icon: '🧠',
    to: '/triage',
  },
  {
    id: 'appointment',
    title: 'Book Appointment',
    description: 'Find doctor slots and reserve an OPD consultation.',
    icon: '📅',
    to: '/appointments',
  },
  {
    id: 'my-appointments',
    title: 'My Appointments',
    description: 'Track all booked consultations and status updates.',
    icon: '🗂️',
    to: '/my-appointments',
  },
  {
    id: 'ambulance',
    title: 'Request Ambulance',
    description: 'Dispatch nearest hospital ambulance with live tracking simulation.',
    icon: '🚑',
    to: '/ambulance',
  },
  {
    id: 'lab',
    title: 'Schedule Lab Test',
    description: 'Book diagnostics with transparent billing details.',
    icon: '🧪',
    to: '/lab-booking',
  },
  {
    id: 'records',
    title: 'View Medical Records',
    description: 'Access reports and download available documents.',
    icon: '📂',
    to: '/medical-records',
  },
  {
    id: 'opd',
    title: 'Explore OPD Departments',
    description: 'Browse specialty departments and care pathways.',
    icon: '🏥',
    to: '/opd-departments',
  },
  {
    id: 'chat-history',
    title: 'Chat History',
    description: 'Review your previous AI and reception conversations.',
    icon: '💬',
    to: '/chat-history',
  },
];

export const doctorsAvailableToday = doctors.slice(0, 8).map((doctor) => ({
  id: doctor.id,
  name: doctor.fullName,
  department: doctor.department,
  image: doctor.profileImage,
  nextSlot: doctor.availableTimeSlots[0] || 'Fully booked',
  status: doctor.availabilityStatus === 'Available' ? 'available' : 'booked',
}));
