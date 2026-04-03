import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Activity, ArrowRight, CheckCircle2, HeartPulse } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const { state, hospitals, updatePatientProfile } = useApp();
  const [formData, setFormData] = useState({
    name: state.patient.name || '',
    selectedHospitalId: state.patient.selectedHospitalId || hospitals[0]?.id || '',
    dob: state.patient.dob || '',
    bloodGroup: state.patient.bloodGroup || '',
    gender: state.patient.gender || '',
    emergencyContact: state.patient.emergencyContact || '',
    lastCheckupDate: state.patient.lastCheckupDate || '',
    bp: state.patient.bp || '',
  });

  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const containerRef = useRef(null);

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
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePatientProfile(formData);
    navigate('/dashboard');
  };

  const formItem = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-med-100 selection:text-med-900">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white" ref={containerRef}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div ref={blob1Ref} className="absolute -left-[10%] -top-[10%] w-[60%] h-[60%] rounded-full bg-med-600/30 blur-3xl opacity-60" />
          <div ref={blob2Ref} className="absolute -right-[10%] bottom-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-3xl opacity-60" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 w-12 h-12 flex items-center justify-center overflow-hidden">
              <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight">Prognosis Care</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Let's personalize <br />
            <span className="text-med-400">your journey.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            We need a few details to tailor the AI diagnostics and doctor recommendations specifically for you.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, text: "Secure Data Encryption" },
            { icon: <HeartPulse className="w-5 h-5 text-rose-400" />, text: "AI-Powered Health Analysis" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
              {item.icon}
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 overflow-y-auto bg-slate-50">
        <div className="min-h-full flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Patient</h2>
              <p className="text-slate-500">Please complete your profile to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >

                {/* Personal Info Group */}
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.label variants={formItem} className="block group">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Full Name</span>
                      <input
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                      />
                    </motion.label>

                    <motion.label variants={formItem} className="block group">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Date of Birth</span>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none text-slate-600"
                        value={formData.dob}
                        onChange={(e) => handleChange('dob', e.target.value)}
                        required
                      />
                    </motion.label>

                    <motion.label variants={formItem} className="block group">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Gender</span>
                      <select
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none text-slate-600"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </motion.label>

                    <motion.label variants={formItem} className="block group">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Blood Group</span>
                      <select
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none text-slate-600"
                        value={formData.bloodGroup}
                        onChange={(e) => handleChange('bloodGroup', e.target.value)}
                        required
                      >
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </motion.label>
                  </div>
                </div>

                {/* Medical Info Group */}
                <div className="md:col-span-2 space-y-6 pt-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Medical & Contact</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.label variants={formItem} className="block group md:col-span-2">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Preferred Hospital</span>
                      <select
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none text-slate-600"
                        value={formData.selectedHospitalId}
                        onChange={(e) => handleChange('selectedHospitalId', e.target.value)}
                        required
                      >
                        {hospitals.map((hospital) => (
                          <option key={hospital.id} value={hospital.id}>
                            {hospital.name}
                          </option>
                        ))}
                      </select>
                    </motion.label>

                    <motion.label variants={formItem} className="block group">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Last Checkup</span>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none text-slate-600"
                        value={formData.lastCheckupDate}
                        onChange={(e) => handleChange('lastCheckupDate', e.target.value)}
                        required
                      />
                    </motion.label>

                    <motion.label variants={formItem} className="block group">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Blood Pressure</span>
                      <input
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none"
                        value={formData.bp}
                        onChange={(e) => handleChange('bp', e.target.value)}
                        placeholder="e.g. 120/80"
                        required
                      />
                    </motion.label>

                    <motion.label variants={formItem} className="block group md:col-span-2">
                      <span className="block text-sm font-medium text-slate-700 mb-1.5 group-focus-within:text-med-600 transition-colors">Emergency Contact</span>
                      <input
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-med-500 focus:ring-4 focus:ring-med-50 transition-all outline-none"
                        value={formData.emergencyContact}
                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                        placeholder="Name & Phone Number"
                        required
                      />
                    </motion.label>
                  </div>
                </div>

              </motion.div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Save & Continue to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
