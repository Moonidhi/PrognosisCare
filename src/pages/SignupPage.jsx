import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getExtendedTermsAndConditionsLines } from '../content/termsAndConditions';
import {
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function SignupPage() {
  const { currentUser, signup, getRoleHomeRoute } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsReviewed, setTermsReviewed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const termsLines = getExtendedTermsAndConditionsLines(500);

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions to continue.');
      return;
    }

    setLoading(true);
    try {
      await signup(form.email, form.password);
      navigate('/welcome');
    } catch (signupError) {
      setError(signupError?.message || 'Unable to create account.');
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
              <UserPlus className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Prognosis Care</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Start Your <br />
            <span className="text-blue-400">Health Journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg mb-8 leading-relaxed"
          >
            Join thousands of patients accessing top-tier diagnostics and specialist consultations from anywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-300">
              <Activity className="w-4 h-4 text-blue-400" />
              AI Triage
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secure Data
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link to="/auth" className="text-xs font-semibold text-med-600 tracking-wider uppercase mb-2 inline-block hover:underline">
                ← Back to Options
              </Link>
              <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
              <p className="text-slate-500 mt-2">Enter your details to get started.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-100 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold"
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
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-med-500 focus:bg-white focus:ring-4 focus:ring-med-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={acceptedTerms}
                      disabled={!termsReviewed}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${acceptedTerms ? 'bg-med-600 border-med-600' : 'border-slate-300 bg-white'
                      } ${!termsReviewed ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {acceptedTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 leading-tight select-none">
                    I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-med-600 font-semibold hover:underline">Terms & Conditions</button>.
                    {!termsReviewed && <span className="block text-xs text-orange-600 mt-1 font-medium">Please read the terms to enable this checkbox.</span>}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-med-600 hover:text-med-700 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowTermsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <p className="text-xs font-bold text-med-600 uppercase tracking-wider">Legal</p>
                  <h3 className="text-xl font-bold text-slate-900">Terms & Conditions</h3>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow text-sm text-slate-600 leading-relaxed space-y-4">
                {termsLines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setTermsReviewed(true);
                    setShowTermsModal(false);
                    setAcceptedTerms(true);
                  }}
                  className="px-6 py-2 bg-med-600 text-white font-semibold rounded-lg hover:bg-med-700 transition-colors shadow-lg shadow-med-600/20"
                >
                  I Agree
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SignupPage;
