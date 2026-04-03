import { Navigate } from 'react-router-dom';

function HospitalLoginPage() {
  // Redirect to dedicated hospital admin login page
  return <Navigate to="/hospital-admin-login" replace />;
}

export default HospitalLoginPage;
