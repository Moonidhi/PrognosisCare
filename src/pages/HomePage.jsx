import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Bot,
  Stethoscope,
  CalendarCheck,
  Building2,
  FileText,
  MessageCircle,
  ArrowRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { contractHospitals, contractDepartments } from '../services/contractHospitalData';

function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title-char',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: 'power4.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-med-600" />,
      title: 'AI-Powered Triage',
      description: 'Get instant preliminary assessment of your symptoms using advanced AI technology.',
      bg: 'bg-blue-50'
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-emerald-600" />,
      title: 'Expert Doctors',
      description: 'Connect with experienced specialists across multiple departments at top hospitals.',
      bg: 'bg-emerald-50'
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-purple-600" />,
      title: 'Easy Appointments',
      description: 'Book appointments with your preferred doctors at your convenience.',
      bg: 'bg-purple-50'
    },
    {
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      title: 'Multi-Hospital Access',
      description: 'Access healthcare services across our network of partner hospitals.',
      bg: 'bg-orange-50'
    },
    {
      icon: <FileText className="w-8 h-8 text-rose-600" />,
      title: 'Medical Records',
      description: 'Securely store and access your complete medical history anytime.',
      bg: 'bg-rose-50'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-cyan-600" />,
      title: '24/7 Support',
      description: 'Get health guidance and support whenever you need it.',
      bg: 'bg-cyan-50'
    },
  ];

  const hospitalFacilities = [
    {
      hospital: 'Max Hospital',
      image: '/images/max_hosp.jpeg',
      features: ['State-of-the-art infrastructure', 'Advanced diagnostic equipment', '24x7 emergency services'],
    },
    {
      hospital: 'Fortis Hospital',
      image: '/images/fortis_hosp.jpeg',
      features: ['Multi-specialty healthcare', 'Advanced surgical facilities', 'ICU & Critical care units'],
    },
    {
      hospital: 'CityCare Hospital',
      image: '/images/city_hosp.jpeg',
      features: ['Comprehensive healthcare services', 'Modern medical technology', 'Experienced medical team'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-med-100 selection:text-med-900">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img src="/images/logo.jpeg" alt="Prognosis Care Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-med-600 transition-colors">Prognosis Care</h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">AI Healthcare Triage</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-med-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-med-100/40 via-blue-50/20 to-transparent"></motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-med-50 border border-med-100 text-med-700 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-med-500 animate-pulse"></span>
              New: Advanced AI Diagnostics Available
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
              <div className="overflow-hidden">
                <span className="hero-title-char inline-block">Healthcare</span>{' '}
                <span className="hero-title-char inline-block text-slate-400">Reimagined</span>
              </div>
              <div className="overflow-hidden bg-gradient-to-r from-med-600 to-blue-600 bg-clip-text text-transparent pb-2">
                <span className="hero-title-char inline-block">With Intelligence</span>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the future of medical care with instant AI-powered triage, seamless appointments, and expert consolidation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/auth"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-med-600 rounded-2xl hover:bg-med-700 transition-all shadow-xl shadow-med-200 hover:shadow-2xl hover:-translate-y-1"
              >
                Start Diagnosis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need for better health</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Comprehensive tools designed to make your healthcare journey smoother and more effective.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
            {[
              { label: 'Partner Hospitals', value: contractHospitals.length },
              { label: 'Expert Doctors', value: '100+' },
              { label: 'Departments', value: contractDepartments.length },
              { label: 'Support', value: '24/7' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-med-400 mb-2">{stat.value}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hospitals */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">World-Class Partners</h2>
              <p className="text-slate-500 text-lg max-w-xl">We collaborate with the most trusted medical institutions to ensure you receive the best care possible.</p>
            </div>
            <Link to="/auth" className="text-med-600 font-semibold hover:text-med-700 flex items-center gap-2 group">
              View all hospitals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hospitalFacilities.map((hospital, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={hospital.image}
                    alt={hospital.hospital}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{hospital.hospital}</h3>
                  <ul className="space-y-3">
                    {hospital.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-med-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Ready to prioritize your health?
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with Prognosis Care.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-2xl hover:shadow-slate-900/50 hover:-translate-y-1"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
              <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold text-slate-900">Prognosis Care</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Prognosis Care. Built for better health.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
