import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginPage() {
  const { currentUser, login, forgotPassword, getRoleHomeRoute } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const storedEmail = localStorage.getItem('pc_remembered_email');
    if (storedEmail) {
      setForm((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateForm = () => {
    if (!isValidEmail(form.email)) return 'Please enter a valid email address.';
    if (!form.password) return 'Please enter your password.';
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
      await login(form.email, form.password);
      if (form.rememberMe) {
        localStorage.setItem('pc_remembered_email', form.email);
      } else {
        localStorage.removeItem('pc_remembered_email');
      }
      navigate('/');
    } catch (authError) {
      setError(authError?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    try {
      await forgotPassword(form.email);
      setToast({ type: 'success', message: 'Reset instructions sent to your email.' });
      setTimeout(() => setToast({ type: '', message: '' }), 5000);
    } catch {
      setToast({ type: 'error', message: 'Unable to process reset. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Brand / Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-med-600 via-slate-900 to-slate-900"
        ></motion.div>

        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 overflow-hidden w-16 h-16 flex items-center justify-center">
              <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Prognosis Care</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Secure Global <br />
            <span className="text-med-400">Healthcare Access</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg mb-8 leading-relaxed"
          >
            Manage diagnostics, consult with top specialists, and access your medical history securely from anywhere in the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              End-to-End Encrypted
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-300">
              <Lock className="w-4 h-4 text-med-400" />
              HIPAA Compliant
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link to="/auth" className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-2 inline-block hover:underline hover:text-med-600 transition-colors">
                ← Back to Options
              </Link>
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
            </div>

            <AnimatePresence>
              {(error || toast.message) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-6 p-4 rounded-xl text-sm font-medium ${error || toast.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                >
                  {error || toast.message}
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-med-600 focus:ring-med-500 transition-colors"
                  />
                  <span className="text-sm text-slate-600">Remember for 30 days</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-semibold text-med-600 hover:text-med-700 hover:underline underline-offset-2 transition-all"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-med-600 hover:text-med-700 transition-colors">
                  Create free account
                </Link>
              </p>
              <div className="mt-4">
                <Link to="/hospital-signup" className="text-xs font-medium text-slate-400 hover:text-med-600 transition-colors">
                  Register as Hospital Admin
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
