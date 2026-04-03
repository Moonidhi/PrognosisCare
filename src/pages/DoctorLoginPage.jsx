import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Stethoscope,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Activity,
    ShieldAlert,
    AlertCircle
} from 'lucide-react';

function DoctorLoginPage() {
    const { currentUser, doctorLogin, getRoleHomeRoute } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (currentUser) {
        return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await doctorLogin(form.email, form.password);
            navigate('/doctor-workspace');
        } catch (err) {
            setError(err?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel - Brand (Emerald Theme) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-700 via-slate-900 to-slate-900"
                ></motion.div>

                <div className="relative z-10 max-w-lg text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                            <Stethoscope className="w-8 h-8 text-emerald-400" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Prognosis Care</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-bold leading-tight mb-6"
                    >
                        Medical Staff <br />
                        <span className="text-emerald-400">Workspace</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-emerald-100/70 text-lg mb-8 leading-relaxed"
                    >
                        Secure access to patient records, AI diagnostics, and clinical scheduling.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="border-l-4 border-emerald-500 pl-4"
                    >
                        <p className="text-sm font-medium text-emerald-300">HIPAA Compliant Session</p>
                        <p className="text-xs text-slate-400 mt-1">
                            All activity is logged and monitored for security.
                        </p>
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
                            <Link to="/auth" className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-2 inline-block hover:underline">
                                ← Back to Options
                            </Link>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1 px-2 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">Doctor Portal</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                            <p className="text-slate-500 mt-2">Sign in to access your clinical dashboard.</p>
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
                                <label className="text-sm font-semibold text-slate-700">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="dr.name@hospital.com"
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
                                        className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-slate-900 placeholder:text-slate-400"
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        Doctor Login
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">
                                Not a doctor?{' '}
                                <Link to="/auth" className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                                    Return to selection
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default DoctorLoginPage;
