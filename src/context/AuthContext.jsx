import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseConfigError, isFirebaseConfigured } from '../services/firebase';
import {
  getHospitalAccounts,
  getHospitalRequests,
  submitHospitalSignup,
} from '../services/adminStore';
import { secureSuperAdminCredentials, hardcodedDoctors } from '../services/secureAuthConfig';

const AuthContext = createContext(null);
const AUTH_SESSION_KEY = 'pc_auth_session';

function getPrimarySessionStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function getLegacySessionStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createMockJwtToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
}

function getRoleHomeRoute(role) {
  if (role === 'super-admin') return '/super-admin-dashboard';
  if (role === 'hospital-admin') return '/doctor-dashboard';
  if (role === 'doctor') return '/doctor-workspace';
  return '/welcome';
}

function getStoredSession() {
  try {
    const primary = getPrimarySessionStorage();
    const legacy = getLegacySessionStorage();

    const raw = primary?.getItem(AUTH_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // Backward compatibility: migrate old localStorage session to sessionStorage
    const legacyRaw = legacy?.getItem(AUTH_SESSION_KEY);
    if (legacyRaw) {
      primary?.setItem(AUTH_SESSION_KEY, legacyRaw);
      legacy?.removeItem(AUTH_SESSION_KEY);
      return JSON.parse(legacyRaw);
    }

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  const primary = getPrimarySessionStorage();
  const legacy = getLegacySessionStorage();
  primary?.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  legacy?.removeItem(AUTH_SESSION_KEY);
}

function clearSession() {
  const primary = getPrimarySessionStorage();
  const legacy = getLegacySessionStorage();
  primary?.removeItem(AUTH_SESSION_KEY);
  legacy?.removeItem(AUTH_SESSION_KEY);
}

function updateSession(updater) {
  const current = getStoredSession();
  if (!current) return null;
  const next = updater(current);
  saveSession(next);
  return next;
}

function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setCurrentUser(session);
    }
    setAuthLoading(false);
  }, []);

  const signup = async (email, password) => {
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 chars and include uppercase, number, and special character.');
    }

    let userData;
    if (!isFirebaseConfigured || !auth) {
      userData = { uid: `patient-${Date.now()}`, email };
    } else {
      // Real Firebase Auth
      const response = await createUserWithEmailAndPassword(auth, email, password);
      userData = response.user;
      // Let errors propagate (e.g., email-already-in-use)
    }

    const session = {
      id: userData.uid,
      email: userData.email,
      name: userData.email?.split('@')[0] || 'Patient',
      role: 'patient',
      needsHospitalSelection: true,
      token: createMockJwtToken({ role: 'patient', email: userData.email }),
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    setCurrentUser(session);
    return { user: session };
  };

  const login = async (email, password) => {
    let userData;
    if (!isFirebaseConfigured || !auth) {
      // Only use mock auth if Firebase is deliberately not configured
      console.warn('[Auth] Firebase not configured. Using mock auth.');
      userData = { uid: `patient-${Date.now()}`, email };
    } else {
      // Real Firebase Auth
      const response = await signInWithEmailAndPassword(auth, email, password);
      userData = response.user;
      // No catch block here - let Firebase errors (wrong-password, user-not-found) propagate to the UI
    }

    const session = {
      id: userData.uid,
      email: userData.email,
      name: userData.email?.split('@')[0] || 'Patient',
      role: 'patient',
      needsHospitalSelection: true,
      token: createMockJwtToken({ role: 'patient', email: userData.email }),
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    setCurrentUser(session);
    return { user: session };
  };

  const superAdminLogin = async (email, password) => {
    if (email !== secureSuperAdminCredentials.email || password !== secureSuperAdminCredentials.password) {
      throw new Error('Invalid credentials');
    }

    const session = {
      id: 'super-admin-1',
      email,
      name: secureSuperAdminCredentials.name,
      role: 'super-admin',
      token: createMockJwtToken({ role: 'super-admin', email }),
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    setCurrentUser(session);
    return session;
  };

  const hospitalSignup = async (payload) => {
    if (!validatePassword(payload.password)) {
      return {
        ok: false,
        error: 'Password must be at least 8 chars and include uppercase, number, and special character.',
      };
    }

    return submitHospitalSignup(payload);
  };

  const hospitalAdminLogin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check localStorage accounts
    const account = getHospitalAccounts().find(
      (item) => item.contactEmail?.trim().toLowerCase() === normalizedEmail
    );
    const request = getHospitalRequests().find(
      (item) => item.contactEmail?.trim().toLowerCase() === normalizedEmail
    );

    if (!account) {
      if (request?.status === 'Pending Approval') {
        throw new Error('Your hospital account is pending super admin approval.');
      }
      if (request?.status === 'Rejected') {
        throw new Error(`Hospital registration rejected. ${request.reviewNote || ''}`.trim());
      }
      if (request?.status === 'More Info Requested') {
        throw new Error(`More information required. ${request.reviewNote || ''}`.trim());
      }
      throw new Error('Hospital account not found. Please complete hospital signup first.');
    }

    if (account.password !== password) {
      throw new Error('Invalid email or password.');
    }

    if (account.status !== 'Active') {
      throw new Error(`Account is ${account.status}. Please contact super admin.`);
    }

    const session = {
      id: account.id,
      email: account.contactEmail,
      name: account.adminName,
      role: 'hospital-admin',
      hospitalId: account.id,
      hospitalName: account.hospitalName,
      token: createMockJwtToken({ role: 'hospital-admin', hospitalId: account.id, email }),
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    setCurrentUser(session);
    return session;
  };

  const doctorLogin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check hardcoded doctor credentials
    const foundDoctor = hardcodedDoctors.find(
      (doc) => doc.email.toLowerCase() === normalizedEmail && doc.password === password
    );

    if (foundDoctor) {
      const session = {
        id: foundDoctor.doctorId,
        email: foundDoctor.email,
        name: foundDoctor.name,
        doctorName: foundDoctor.doctorName,
        doctorId: foundDoctor.doctorId, // Required for dashboard
        department: foundDoctor.department,
        role: 'doctor', // Specific role for doctors
        hospitalId: foundDoctor.hospitalId,
        hospitalName: foundDoctor.hospitalName,
        token: createMockJwtToken({
          role: 'doctor',
          hospitalId: foundDoctor.hospitalId,
          email: foundDoctor.email,
        }),
        loginAt: new Date().toISOString(),
      };

      saveSession(session);
      setCurrentUser(session);
      return session;
    }

    throw new Error('Invalid doctor credentials.');
  };

  const logout = async () => {
    clearSession();
    setCurrentUser(null);
  };

  const completeHospitalSelection = () => {
    const nextSession = updateSession((session) => ({
      ...session,
      needsHospitalSelection: false,
    }));

    if (nextSession) {
      setCurrentUser(nextSession);
    }
  };

  const forgotPassword = async (email) => {
    if (!email) {
      throw new Error('Please provide your email.');
    }

    if (!isFirebaseConfigured || !auth) {
      return { ok: true };
    }

    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  };

  const value = useMemo(
    () => ({
      currentUser,
      authLoading,
      isFirebaseConfigured,
      firebaseConfigError,
      signup,
      login,
      superAdminLogin,
      hospitalSignup,
      hospitalAdminLogin,
      doctorLogin,
      forgotPassword,
      logout,
      completeHospitalSelection,
      getRoleHomeRoute,
    }),
    [currentUser, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
