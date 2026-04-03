import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Stethoscope,
  Building2,
  ShieldAlert,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

function AuthOptionsPage() {
  const { currentUser, getRoleHomeRoute } = useAuth();

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blob1Ref.current, {
        x: "30%",
        y: "20%",
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(blob2Ref.current, {
        x: "-20%",
        y: "-30%",
        scale: 1.2,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    return () => ctx.revert();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={blob1Ref} className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-med-200/20 blur-3xl" />
        <div ref={blob2Ref} className="absolute -right-[10%] -bottom-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-med-100 text-med-700 text-xs font-bold tracking-wider uppercase mb-4">
            Secure Access
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome to <span className="text-med-600">Prognosis Care</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select your role to access your personalized dashboard.
            Secure, encrypted, and HIPAA compliant.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Patient Card */}
          <motion.div variants={item} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-med-500/5 to-blue-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
            <div className="relative bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-med-200 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-med-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-med-600 transition-colors duration-300">
                <User className="w-7 h-7 text-med-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Patient</h3>
              <p className="text-slate-500 text-sm mb-8 flex-grow">
                Book appointments, view medical records, and access AI triage features.
              </p>
              <div className="space-y-3">
                <Link to="/login" className="flex items-center justify-center w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors group/btn">
                  Login
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/signup" className="flex items-center justify-center w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Doctor Card */}
          <motion.div variants={item} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
            <div className="relative bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                <Stethoscope className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Doctor</h3>
              <p className="text-slate-500 text-sm mb-8 flex-grow">
                Access your schedule, patient records, and clinical tools.
              </p>
              <div className="mt-auto">
                <Link to="/doctor-login" className="flex items-center justify-center w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 group/btn">
                  Doctor Login
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Hospital Admin Card */}
          <motion.div variants={item} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
            <div className="relative bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Building2 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hospital Admin</h3>
              <p className="text-slate-500 text-sm mb-8 flex-grow">
                Manage doctors, departments, and hospital profile.
              </p>
              <div className="space-y-3 mt-auto">
                <Link to="/hospital-login" className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 group/btn">
                  Admin Login
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/hospital-signup" className="flex items-center justify-center w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Register
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Super Admin Card */}
          <motion.div variants={item} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
            <div className="relative bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 transition-colors duration-300">
                <ShieldAlert className="w-7 h-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Super Admin</h3>
              <p className="text-slate-500 text-sm mb-8 flex-grow">
                Platform governance, compliance, and system oversight.
              </p>
              <div className="mt-auto">
                <Link to="/super-admin-login" className="flex items-center justify-center w-full py-3 px-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors shadow-lg shadow-slate-800/20 group/btn">
                  System Login
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            Need help? <a href="#" className="font-medium text-med-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthOptionsPage;
