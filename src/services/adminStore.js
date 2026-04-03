const HOSPITAL_REQUESTS_KEY = 'pc_hospital_requests';
const HOSPITAL_ACCOUNTS_KEY = 'pc_hospital_accounts';
const PLATFORM_LOGS_KEY = 'pc_platform_logs';

export const ALLOWED_HOSPITALS = [
  'Fortis Hospital',
  'CityCare Multi-Speciality Hospital',
  'Max Hospital',
];

const defaultHospitalAccounts = [
  {
    id: 'hosp-1',
    hospitalName: 'CityCare Multi-Speciality Hospital',
    registrationNumber: 'MH-REG-1024',
    address: '12 Heartline Ave',
    city: 'Mumbai',
    state: 'Maharashtra',
    contactEmail: 'admin@citycarehospital.com',
    phone: '+91 90000 11111',
    adminName: 'Rahul Mehta',
    adminRole: 'Operations Manager',
    password: 'Hospital@123',
    status: 'Active',
    approvedAt: '2026-01-10T10:00:00.000Z',
  },
];

function getList(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function getHospitalRequests() {
  return getList(HOSPITAL_REQUESTS_KEY, []);
}

export function saveHospitalRequests(requests) {
  setList(HOSPITAL_REQUESTS_KEY, requests);
}

export function getHospitalAccounts() {
  const stored = getList(HOSPITAL_ACCOUNTS_KEY, []);

  const hasDefault = stored.some(
    (account) => account.contactEmail?.trim().toLowerCase() === defaultHospitalAccounts[0].contactEmail
  );

  const accounts = hasDefault ? stored : [...stored, ...defaultHospitalAccounts];
  setList(HOSPITAL_ACCOUNTS_KEY, accounts);
  return accounts;
}

export function saveHospitalAccounts(accounts) {
  setList(HOSPITAL_ACCOUNTS_KEY, accounts);
}

export function addPlatformLog(action, actor = 'system') {
  const logs = getList(PLATFORM_LOGS_KEY, []);
  const entry = {
    id: `LOG-${Date.now().toString().slice(-8)}`,
    action,
    actor,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...logs].slice(0, 100);
  setList(PLATFORM_LOGS_KEY, next);
  return entry;
}

export function getPlatformLogs() {
  return getList(PLATFORM_LOGS_KEY, []);
}

export function submitHospitalSignup(payload) {
  const requests = getHospitalRequests();
  const normalizedEmail = payload.contactEmail?.trim().toLowerCase();
  const normalizedHospital = payload.hospitalName?.trim();

  if (!ALLOWED_HOSPITALS.includes(normalizedHospital)) {
    return { ok: false, error: 'Please select a valid hospital from the approved list.' };
  }

  const exists = requests.some((req) => req.contactEmail?.trim().toLowerCase() === normalizedEmail);
  const accounts = getHospitalAccounts();
  const accountExists = accounts.some((acc) => acc.contactEmail?.trim().toLowerCase() === normalizedEmail);
  const activeHospitalExists = accounts.some(
    (acc) => acc.hospitalName === normalizedHospital && acc.status === 'Active'
  );

  const pendingHospitalExists = requests.some(
    (req) => req.hospitalName === normalizedHospital && req.status === 'Pending Approval'
  );

  if (activeHospitalExists) {
    return { ok: false, error: 'This hospital already has an active admin.' };
  }

  if (pendingHospitalExists) {
    return { ok: false, error: 'A signup request for this hospital is already pending approval.' };
  }

  if (exists || accountExists) {
    return { ok: false, error: 'This admin email is already registered or pending approval.' };
  }

  const newRequest = {
    id: `REQ-${Date.now().toString().slice(-8)}`,
    ...payload,
    hospitalName: normalizedHospital,
    contactEmail: normalizedEmail,
    status: 'Pending Approval',
    submittedAt: new Date().toISOString(),
    reviewNote: '',
  };

  saveHospitalRequests([newRequest, ...requests]);
  addPlatformLog(`New hospital signup request: ${payload.hospitalName}`, payload.adminName);
  return { ok: true, request: newRequest };
}

export function reviewHospitalRequest(requestId, decision, reviewNote = '') {
  const requests = getHospitalRequests();
  const target = requests.find((item) => item.id === requestId);
  if (!target) return { ok: false, error: 'Request not found.' };

  const nextRequests = requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          status:
            decision === 'approve'
              ? 'Approved'
              : decision === 'reject'
                ? 'Rejected'
                : 'More Info Requested',
          reviewNote,
          reviewedAt: new Date().toISOString(),
        }
      : request
  );
  saveHospitalRequests(nextRequests);

  if (decision === 'approve') {
    const accounts = getHospitalAccounts();
    const already = accounts.some((acc) => acc.contactEmail === target.contactEmail);
    if (!already) {
      const newAccount = {
        id: `HOSP-${Date.now().toString().slice(-8)}`,
        hospitalName: target.hospitalName,
        registrationNumber: target.registrationNumber,
        address: target.address,
        city: target.city,
        state: target.state,
        contactEmail: target.contactEmail,
        phone: target.phone,
        adminName: target.adminName,
        adminRole: target.adminRole,
        password: target.password,
        licenseFileName: target.licenseFileName,
        status: 'Active',
        approvedAt: new Date().toISOString(),
      };
      saveHospitalAccounts([newAccount, ...accounts]);
    }

    addPlatformLog(`Hospital approved: ${target.hospitalName}`, 'super-admin');
  }

  if (decision === 'reject') {
    addPlatformLog(`Hospital rejected: ${target.hospitalName}`, 'super-admin');
  }

  if (decision === 'more-info') {
    addPlatformLog(`More info requested: ${target.hospitalName}`, 'super-admin');
  }

  return { ok: true };
}

export function updateHospitalStatus(hospitalId, status) {
  const accounts = getHospitalAccounts();
  const next = accounts.map((account) => (account.id === hospitalId ? { ...account, status } : account));
  saveHospitalAccounts(next);
  addPlatformLog(`Hospital status updated (${status}): ${hospitalId}`, 'super-admin');
  return next;
}
