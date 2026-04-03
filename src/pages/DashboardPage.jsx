import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PatientSummaryCard from '../components/dashboard/PatientSummaryCard';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';
import DoctorAvailabilitySection from '../components/dashboard/DoctorAvailabilitySection';
import AIHealthInsightCard from '../components/dashboard/AIHealthInsightCard';
import UpcomingEventsSection from '../components/dashboard/UpcomingEventsSection';
import ReceptionChatWidget from '../components/dashboard/ReceptionChatWidget';
import { quickActions } from '../services/mockDashboardData';

function getRiskScore(level) {
  if (level === 'high') return 82;
  if (level === 'medium') return 58;
  return 22;
}

function computeRiskFromTests(tests) {
  if (!tests.length) return 0;
  const scoreMap = { high: 85, medium: 60, low: 30 };
  const total = tests.reduce((sum, test) => sum + (scoreMap[test.priority] || 30), 0);
  return Math.round(total / tests.length);
}

function buildTrend(score) {
  return [
    { day: 'Mon', score: Math.min(100, score + 8) },
    { day: 'Tue', score: Math.min(100, score + 6) },
    { day: 'Wed', score: Math.min(100, score + 4) },
    { day: 'Thu', score: Math.min(100, score + 3) },
    { day: 'Fri', score: Math.min(100, score + 1) },
    { day: 'Sat', score },
  ];
}

function buildUpcomingEvents(state) {
  const events = [];

  if (state.latestBooking) {
    events.push({
      id: 'evt-lab-booking',
      type: 'Scheduled Lab Test',
      title: `${state.latestBooking.tests.map((test) => test.name).join(', ')}`,
      date: new Date(state.latestBooking.slot).toLocaleString(),
      status: state.latestBooking.paymentStatus === 'paid' ? 'scheduled' : 'pending',
      action: 'View Booking',
      to: '/booking-confirmation',
    });

    if (state.latestBooking.paymentStatus !== 'paid') {
      events.push({
        id: 'evt-pending-payment',
        type: 'Pending Payment',
        title: 'Complete your test payment to confirm slot',
        date: 'Action required now',
        status: 'pending',
        action: 'Pay Now',
        to: '/payment',
      });
    }
  }

  if (state.reports.length) {
    events.push({
      id: 'evt-report-ready',
      type: 'Report Ready',
      title: state.reports[0].fileName,
      date: `Uploaded ${new Date(state.reports[0].uploadedAt).toLocaleString()}`,
      status: 'ready',
      action: 'Download Report',
      to: '/medical-records',
    });
  }

  if (!events.length) {
    events.push({
      id: 'evt-empty',
      type: 'No Upcoming Events',
      title: 'No appointments, tests, or pending actions yet.',
      date: 'Use quick actions to start',
      status: 'confirmed',
      action: 'Open AI Assistant',
      to: '/triage',
    });
  }

  return events;
}

function DashboardPage() {
  const { state } = useApp();
  const selectedHospitalId = state.patient.selectedHospitalId || state.selectedHospital?.id;
  const patientRiskScore = getRiskScore(state.patient.riskLevel);
  const aiRiskScore = computeRiskFromTests(state.recommendedTests);
  const hasSymptomsData = Boolean(
    state.patientSymptoms.trim() && state.recommendationSummary.trim() && state.recommendedTests.length
  );

  const aiInsight = useMemo(
    () => ({
      recentSymptoms: state.patientSymptoms,
      riskScore: state.aiConfidenceScore || 0,
      riskLevel: state.aiRiskLevel || 'Low',
      recommendedDepartment: state.aiRecommendedDepartment || 'General Medicine',
      pendingTests: state.recommendedTests.map((test) => test.name),
      trend: buildTrend(state.aiConfidenceScore || 0),
      reasoning: state.aiReasoning || [],
    }),
    [state.patientSymptoms, state.aiConfidenceScore, state.aiRiskLevel, state.aiRecommendedDepartment, state.recommendedTests, state.aiReasoning]
  );

  const upcomingEvents = useMemo(() => buildUpcomingEvents(state), [state]);
  const doctorsAvailableToday = useMemo(
    () =>
      state.doctors
        .filter((doctor) => doctor.hospitalId === selectedHospitalId)
        .slice(0, 8)
        .map((doctor) => ({
          id: doctor.id,
          name: doctor.fullName,
          department: doctor.department,
          image: doctor.profileImage,
          nextSlot: doctor.availableTimeSlots[0] || 'Fully booked',
          status: doctor.availabilityStatus === 'Available' ? 'available' : 'booked',
        })),
    [selectedHospitalId, state.doctors]
  );

  return (
    <div className="page-shell space-y-4 pb-24">
      <DashboardHeader patientName={state.patient.name} />
      <PatientSummaryCard patient={state.patient} />

      <section className="grid gap-3 sm:grid-cols-2">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Appointments</p>
          <p className="mt-1 text-2xl font-bold text-med-700">{state.appointments.length}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Medical Records</p>
          <p className="mt-1 text-2xl font-bold text-med-700">{state.medicalRecords.length + state.reports.length}</p>
        </article>
      </section>

      <QuickActionsPanel actions={quickActions} />
      <DoctorAvailabilitySection doctors={doctorsAvailableToday} />

      <UpcomingEventsSection events={upcomingEvents} />

      {hasSymptomsData ? <AIHealthInsightCard insight={aiInsight} /> : null}
      <ReceptionChatWidget />
    </div>
  );
}

export default DashboardPage;
