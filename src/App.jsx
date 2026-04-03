import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import OpdDepartmentsPage from './pages/OpdDepartmentsPage';
import DepartmentDoctorsPage from './pages/DepartmentDoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import AmbulanceRequestPage from './pages/AmbulanceRequestPage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import TriagePage from './pages/TriagePage';
import LabBookingPage from './pages/LabBookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import AdminHospitalPanelPage from './pages/AdminHospitalPanelPage';
import HospitalSignupPage from './pages/HospitalSignupPage';
import HospitalLoginPage from './pages/HospitalLoginPage';
import HospitalAdminLoginPage from './pages/HospitalAdminLoginPage';
import HospitalDashboardPage from './pages/HospitalDashboardPage';
import SuperAdminLoginPage from './pages/SuperAdminLoginPage';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import AuthOptionsPage from './pages/AuthOptionsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import SignupPage from './pages/SignupPage';
import NotificationToast from './components/NotificationToast';
import ChatBot from './components/ChatBot';

// ... (existing imports)


import HospitalSelectionModal from './components/HospitalSelectionModal';
import PortalBackButton from './components/PortalBackButton';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';

const patientNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/welcome', label: 'Welcome' },
  { to: '/my-appointments', label: 'My Appointments' },
  { to: '/triage', label: 'AI Assistant' },
  { to: '/ambulance', label: 'Ambulance' },
  { to: '/medical-records', label: 'Medical Records' },
];

const hospitalNavItems = [
  { to: '/hospital-dashboard', label: 'Hospital Dashboard' },
  { to: '/medical-records', label: 'Medical Records' },
];

const doctorNavItems = [
  { to: '/doctor-workspace', label: 'Doctor Workspace' },
  { to: '/my-appointments', label: 'My Calendar' },
];

const superAdminNavItems = [
  { to: '/super-admin-dashboard', label: 'Super Dashboard' },
];

function App() {
  const location = useLocation();
  const { currentUser, logout, getRoleHomeRoute, completeHospitalSelection } = useAuth();
  const { hospitals, state, setPatientSelectedHospital } = useApp();

  const showHospitalSelectionModal =
    currentUser?.role === 'patient' && Boolean(currentUser?.needsHospitalSelection);

  const handleHospitalConfirm = (hospitalId) => {
    setPatientSelectedHospital(hospitalId);
    completeHospitalSelection();
  };

  const navItems =
    currentUser?.role === 'super-admin'
      ? superAdminNavItems
      : currentUser?.role === 'hospital-admin'
        ? hospitalNavItems
        : currentUser?.role === 'doctor'
          ? doctorNavItems
          : patientNavItems;

  const showGlobalBackButton = location.pathname !== '/auth' && location.pathname !== '/';

  return (
    <div className="min-h-screen bg-red-50 text-slate-900">
      {currentUser ? (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Prognosis Care</p>
              <h1 className="text-lg font-bold">AI Healthcare Triage & Diagnostics</h1>
            </div>
            <div className="flex items-center gap-2">
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-med-100 text-med-700' : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <button type="button" className="btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </header>
      ) : null}

      {showGlobalBackButton ? (
        <div className="page-shell pt-4">
          <PortalBackButton fallbackPath="/" />
        </div>
      ) : null}

      <main className="animate-fadeIn">
        <Routes>
          <Route path="/auth" element={<AuthOptionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/super-admin-login" element={<SuperAdminLoginPage />} />
          <Route path="/hospital-signup" element={<HospitalSignupPage />} />
          <Route path="/hospital-login" element={<HospitalLoginPage />} />
          <Route path="/doctor-login" element={<DoctorLoginPage />} />
          <Route path="/hospital-admin-login" element={<HospitalAdminLoginPage />} />
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to={getRoleHomeRoute(currentUser?.role)} replace />
              ) : (
                <HomePage />
              )
            }
          />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute allowedRoles={['patient', 'doctor']}>
                <MyAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd-departments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <OpdDepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opd-departments/:departmentSlug"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DepartmentDoctorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/:id"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DoctorProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-history"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ChatHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/triage"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <TriagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ambulance"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AmbulanceRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-booking"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <LabBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute allowedRoles={['patient', 'hospital-admin']}>
                <MedicalRecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hospital"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AdminHospitalPanelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['hospital-admin']}>
                <HospitalDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-workspace"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital-dashboard"
            element={
              <ProtectedRoute allowedRoles={['hospital-admin']}>
                <HospitalDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <SuperAdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/app" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {currentUser ? <NotificationToast /> : null}
      {currentUser ? <ChatBot /> : null}

      {showHospitalSelectionModal ? (
        <HospitalSelectionModal
          hospitals={hospitals}
          initialHospitalId={state.patient.selectedHospitalId}
          onConfirm={handleHospitalConfirm}
        />
      ) : null}
    </div>
  );
}

export default App;
