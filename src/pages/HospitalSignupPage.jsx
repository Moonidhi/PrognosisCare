import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ALLOWED_HOSPITALS } from '../services/adminStore';
import {
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Upload,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

const acceptedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

function HospitalSignupPage() {
  const { hospitalSignup } = useAuth();
  const [form, setForm] = useState({
    hospitalName: ALLOWED_HOSPITALS[0],
    adminName: '',
    contactEmail: '',
    phone: '',
    registrationNumber: '',
    address: '',
    city: '',
    state: '',
    adminRole: 'Hospital Admin',
    password: '',
    confirmPassword: '',
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 3500);
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isStrongPassword = (value) =>
    value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });

  const handleFileChange = (event) => {
    setError('');
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setLicenseFile(null);
      return;
    }

    if (!acceptedMimeTypes.includes(selectedFile.type)) {
      setError('Only PDF, JPG, or PNG files are allowed.');
      event.target.value = '';
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be 5MB or less.');
      event.target.value = '';
      return;
    }

    setLicenseFile(selectedFile);
  };

  const validateForm = () => {
    if (!ALLOWED_HOSPITALS.includes(form.hospitalName)) {
      return 'Please select a valid hospital.';
    }
    if (!isValidEmail(form.contactEmail)) {
      return 'Please enter a valid work email.';
    }
    if (!licenseFile) {
      return 'Please upload a hospital license.';
    }
    if (!isStrongPassword(form.password)) {
      return 'Password must include 8+ chars, uppercase, number, and special character.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const licenseFileDataUrl = await fileToDataUrl(licenseFile);

      const response = await hospitalSignup({
        ...form,
        licenseFileName: licenseFile.name,
        licenseFileType: licenseFile.type,
        licenseFileSize: licenseFile.size,
        licenseFileDataUrl,
      });

      if (!response.ok) {
        setError(response.error || 'Unable to submit hospital registration request.');
        setLoading(false);
        return;
      }

      showToast('success', 'Registration submitted. Status: Pending Approval.');
      setForm({
        hospitalName: ALLOWED_HOSPITALS[0],
        adminName: '',
        contactEmail: '',
        phone: '',
        registrationNumber: '',
        address: '',
        city: '',
        state: '',
        adminRole: 'Hospital Admin',
        password: '',
        confirmPassword: '',
      });
      setLicenseFile(null);
    } catch {
      setError('Unable to process your file. Please try another file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Brand / Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-slate-900 to-slate-900"
        ></motion.div>

        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Prognosis Care</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Partner with <br />
            <span className="text-blue-400">Future Healthcare</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg mb-8 leading-relaxed"
          >
            Join our network of elite hospitals delivering AI-driven patient care and streamlined diagnostics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Secure Admin Registration</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Stethoscope className="w-5 h-5 text-blue-400" />
              <span>Verified Hospital Network</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Digital License Validation</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 my-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link to="/auth" className="text-xs font-semibold text-med-600 tracking-wider uppercase mb-2 inline-block hover:underline">
                ← Back to Options
              </Link>
              <h2 className="text-3xl font-bold text-slate-900">Hospital Registration</h2>
              <p className="text-slate-500 mt-2">Submit your details for admin approval.</p>
            </div>

            <AnimatePresence>
              {(error || toast.message) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-start gap-3 ${toast.message
                    ? (toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100')
                    : 'bg-red-50 text-red-700 border-red-100'
                    }`}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {toast.message || error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Grid for compact fields */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Hospital Select */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Select Hospital</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <select
                      value={form.hospitalName}
                      onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 appearance-none"
                    >
                      {ALLOWED_HOSPITALS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Admin Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Admin Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={form.adminName}
                      onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="admin@hospital.com"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="+91 98765..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Registration Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Reg. Number</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="HOSP-REG-XXX"
                      value={form.registrationNumber}
                      onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="123 Medical Lane, Health District"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* File Upload */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Hospital License (Max 5MB)</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="license-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="license-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-2 pb-3">
                        <Upload className="w-6 h-6 text-slate-400 mb-1" />
                        <p className="text-sm text-slate-500">
                          {licenseFile ? <span className="font-semibold text-med-600">{licenseFile.name}</span> : <span>Click to upload PDF/JPG</span>}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Passwords */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Strong Password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat Password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      Submit for Approval
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Already approved?{' '}
                <Link to="/login?role=hospital-admin" className="font-semibold text-med-600 hover:text-med-700 transition-colors">
                  Login as Admin
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HospitalSignupPage;
