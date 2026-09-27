import React from 'react';
import {
  Compass,
  GraduationCap,
  Sparkles,
  MapPin,
  Target,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';

const CareerNodeGraph = ({
  step = 1,
  data = {},
  className = ''
}) => {
  const {
    educationLevel = '',
    classYear = '',
    stream = '',
    percentageOrCgpa = '',
    state = '',
    careerInterests = [],
    interests = []
  } = data;

  const nodes = [
    {
      id: 1,
      stepNumber: '01',
      title: 'Academic Base',
      subtitle: educationLevel || 'Current Education',
      icon: GraduationCap,
      activeColor: 'from-amber-500 to-amber-600',
      glowColor: 'rgba(245, 158, 11, 0.25)'
    },
    {
      id: 2,
      stepNumber: '02',
      title: 'Interests & Domicile',
      subtitle: state ? `${state} • ${interests.length} topics` : 'Location & Passions',
      icon: Compass,
      activeColor: 'from-amber-500 to-amber-600',
      glowColor: 'rgba(245, 158, 11, 0.25)'
    },
    {
      id: 3,
      stepNumber: '03',
      title: 'Career Goals',
      subtitle: careerInterests.length > 0 ? `${careerInterests.length} Sectors Selected` : 'Target Domains',
      icon: Target,
      activeColor: 'from-amber-500 to-amber-600',
      glowColor: 'rgba(245, 158, 11, 0.25)'
    }
  ];

  return (
    <div className={`relative flex flex-col justify-between h-full space-y-6 ${className}`}>
      {/* Visual Identity Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-bold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>PathFinder Career Compass</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          Your path <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">starts here.</span>
        </h1>
        <p className="text-sm text-stone-400 mt-2.5 leading-relaxed max-w-md">
          Tell us about your background and ambitions. We calibrate thousands of entrance exams, scholarships, degree roadmaps, and career pathways tailored directly to you.
        </p>
      </div>

      {/* Connected Node Visualizer */}
      <div className="relative py-4">
        {/* SVG Connection Lines */}
        <div className="relative space-y-3">
          {nodes.map((node, index) => {
            const isCompleted = step > node.id;
            const isCurrent = step === node.id;
            const Icon = node.icon;

            return (
              <div key={node.id} className="relative">
                {/* Connecting Line between steps */}
                {index < nodes.length - 1 && (
                  <div
                    className={`absolute left-5.5 top-11 w-0.5 h-8 transition-colors duration-300 z-0 ${
                      step > node.id
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600'
                        : isCurrent
                          ? 'bg-gradient-to-b from-amber-500/50 to-stone-800'
                          : 'bg-stone-800'
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-stone-850 bg-stone-900 border border-amber-500/50 shadow-lg shadow-amber-500/5 translate-x-1'
                      : isCompleted
                        ? 'bg-stone-900/60 border border-stone-800'
                        : 'bg-stone-900/30 border border-stone-800/40 opacity-50'
                  }`}
                >
                  {/* Node Circle */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isCurrent
                        ? `bg-gradient-to-br ${node.activeColor} text-stone-950 shadow-md shadow-amber-500/25 ring-4 ring-amber-500/20`
                        : isCompleted
                          ? 'bg-emerald-500 text-stone-950 shadow-xs'
                          : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-stone-950" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Node Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-bold uppercase tracking-wider text-stone-500">
                        Step {node.stepNumber}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-amber-500/20 text-amber-300">
                          Active
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-1.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300">
                          Done
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xs font-bold truncate mt-0.5 ${
                      isCurrent ? 'text-amber-300 font-black' : 'text-stone-200'
                    }`}>
                      {node.title}
                    </h4>
                    <p className="text-2xs text-stone-400 truncate mt-0.5">
                      {node.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Live Blueprint Card */}
      <div className="bg-[#0e0e0d] text-white rounded-2xl p-4.5 border border-stone-800 shadow-lg relative overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-2xs font-bold uppercase tracking-wider text-stone-300">
                Live Pathway Calibration
              </span>
            </div>
            <span className="text-2xs font-extrabold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/50">
              {step === 1 ? '33% Synced' : step === 2 ? '66% Synced' : '99% Ready'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 text-2xs">
            <div>
              <span className="text-stone-400 block font-medium">Education</span>
              <span className="font-bold text-stone-100 truncate block mt-0.5">
                {educationLevel || 'Class 10 / 12th / Degree'}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block font-medium">Current Status</span>
              <span className="font-bold text-stone-100 truncate block mt-0.5">
                {classYear || 'Selecting year...'}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block font-medium">Specialization</span>
              <span className="font-bold text-amber-300 truncate block mt-0.5">
                {stream || 'Selecting field...'}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block font-medium">Academic Score</span>
              <span className="font-bold text-emerald-400 truncate block mt-0.5">
                {percentageOrCgpa || 'Self-reported'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between text-2xs text-stone-400 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Verified Official Data
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Zero Spam
        </span>
      </div>
    </div>
  );
};

export default CareerNodeGraph;
