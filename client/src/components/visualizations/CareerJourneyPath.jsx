import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Award,
  Search,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const milestones = [
  {
    id: 'education',
    step: '01',
    title: 'Education Foundation',
    subtitle: 'Class 10, Intermediate (MPC/BiPC/CEC), Polytechnic Diploma, or ITI',
    icon: GraduationCap,
    color: 'from-amber-600 to-orange-600',
    accentBg: 'bg-amber-950/50 text-amber-300 border-amber-800/60',
    badge: 'Stage 1',
    description: 'Build your academic bedrock. Choose between Higher Secondary (Class 11-12), 3-year Vocational Polytechnic, or technical ITI certifications based on your aptitude.',
    examples: ['CBSE / State Boards', 'Polytechnic Diploma', 'ITI Trades (Fitter, Electrician)', 'International Baccalaureate']
  },
  {
    id: 'skills',
    step: '02',
    title: 'In-Demand Skills',
    subtitle: 'Modern Tooling, Coding, Analytical Thinking & Hands-on Aptitude',
    icon: Sparkles,
    color: 'from-amber-500 to-yellow-600',
    accentBg: 'bg-amber-950/50 text-amber-300 border-amber-800/60',
    badge: 'Stage 2',
    description: 'Equip yourself with practical, market-ready competencies before and alongside formal degrees to stand out in national competition.',
    examples: ['Python & Web Tech', 'Data & Quantitative Math', 'Design & UX Thinking', 'Applied Electronics & Robotics']
  },
  {
    id: 'exams',
    step: '03',
    title: 'Gateway Exams',
    subtitle: 'National & State Competitive / Entrance Gateways',
    icon: Award,
    color: 'from-orange-500 to-amber-600',
    accentBg: 'bg-orange-950/50 text-orange-300 border-orange-800/60',
    badge: 'Stage 3',
    description: 'Crack standardized gateway evaluations for admission into prestigious institutions or direct recruitment into state and central services.',
    examples: ['JEE Main / Advanced', 'NEET UG', 'CUET & CLAT', 'NDA & UPSC Prelims']
  },
  {
    id: 'opportunities',
    step: '04',
    title: 'Opportunities & Fellowships',
    subtitle: 'Internships, Research Grants, Apprenticeships & Hackathons',
    icon: Search,
    color: 'from-yellow-500 to-amber-600',
    accentBg: 'bg-yellow-950/50 text-yellow-300 border-yellow-800/60',
    badge: 'Stage 4',
    description: 'Gain real-world industry and research exposure through paid government apprenticeships, global fellowships, and corporate traineeships.',
    examples: ['ISRO YUVIKA Program', 'Google Summer of Code (GSoC)', 'NAPS ITI Apprenticeship', 'DRDO Trainee Scheme']
  },
  {
    id: 'career',
    step: '05',
    title: 'Dream Career Launch',
    subtitle: 'High-Impact Roles, Civil Services, Tech Leadership & Innovation',
    icon: Briefcase,
    color: 'from-amber-400 to-orange-500',
    accentBg: 'bg-amber-950/50 text-amber-300 border-amber-800/60',
    badge: 'Stage 5',
    description: 'Reach your target profession with verified growth prospects, clear progression pathways, and long-term financial freedom.',
    examples: ['AI Systems Engineer', 'Civil Services Officer (IAS/IPS)', 'Medical Specialist / Surgeon', 'Commercial Aviation Pilot']
  }
];

const CareerJourneyPath = () => {
  const [activeStep, setActiveStep] = useState(2); // default to Exams

  return (
    <div className="bg-gradient-to-br from-[#0c0c0b] via-[#171410] to-[#0c0c0b] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden border border-amber-950/60">
      {/* Background ambient warm lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-800/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Interactive Progression Pipeline
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          The 5-Stage Career Blueprint
        </h2>
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
          From your foundational schooling to dream careers, PathFinder maps out each vital transition point so you never miss an eligibility window or critical milestone.
        </p>
      </div>

      {/* Interactive Step Navigator Bar */}
      <div className="relative z-10 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {milestones.map((milestone, idx) => {
            const Icon = milestone.icon;
            const isSelected = activeStep === idx;

            return (
              <button
                key={milestone.id}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/15 -translate-y-1'
                    : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-800/80 hover:border-amber-900/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-amber-500/30 text-amber-300' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {milestone.step}
                  </span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{milestone.title}</h4>
                <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{milestone.badge}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Expanded Showcase */}
      <div className="bg-stone-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-stone-800 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 tracking-wider">
                STAGE {milestones[activeStep].step} DETAIL
              </span>
              <span className="text-stone-600">•</span>
              <span className="text-xs font-bold text-stone-300">
                {milestones[activeStep].subtitle}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {milestones[activeStep].title}
            </h3>

            <p className="text-sm text-stone-300 leading-relaxed">
              {milestones[activeStep].description}
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Key Examples & Opportunities in PathFinder:
              </p>
              <div className="flex flex-wrap gap-2">
                {milestones[activeStep].examples.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-800/90 text-stone-200 text-xs font-semibold border border-stone-700/80"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs for this step */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all text-center"
            >
              <span>Explore Career Pathways</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-white font-bold text-xs border border-stone-700 transition-all text-center"
            >
              <span>View Active Matches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerJourneyPath;
