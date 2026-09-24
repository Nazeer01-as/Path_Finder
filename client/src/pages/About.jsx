import React from 'react';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Target,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const cohorts = [
    'Class 10 students exploring pathways',
    'Intermediate / 11th–12th (MPC, BiPC, CEC, HEC)',
    'Diploma & Polytechnic students seeking Lateral Entry & Jobs',
    'ITI & Vocational trade apprentices',
    'Undergraduate college students',
    'Postgraduate & Masters aspirants',
    'Engineering students seeking projects & off-campus internships',
    'Degree students exploring competitive government exams',
    'Students in need of merit & means scholarships',
    'Young innovators looking for skill-development programs'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Our Vision & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering Every Student to Discover Their Next Step
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          «After Class 10 or at any stage of education, students often do not know what options are available, which path they can choose, which entrance examinations they can write, what eligibility criteria they need, what scholarships they can apply for, and what career opportunities are available.»
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Democratized Opportunity</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether in a major city or a rural village, every student deserves equal, transparent access to structured career roadmaps, exam dates, and government welfare programs.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Strict Data Integrity</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We never fabricate examination fees, dates, or criteria. Every record links directly to the official government or conducting body portal so students can apply securely.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Explainable Recommendations</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our rule-based engine clearly shows <em>why</em> an exam or scholarship is suggested for you based on your education level, stream, and declared career interests.
          </p>
        </div>
      </div>

      {/* Cohorts Covered */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl">
        <div className="max-w-2xl mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">Who PathFinder Is Built For</h2>
          <p className="text-slate-400 text-sm">
            We go far beyond typical single-stream guides. Our platform supports students at every milestone:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cohorts.map((cohort, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>{cohort}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
        >
          Join PathFinder Today
        </Link>
      </div>
    </div>
  );
};

export default About;
