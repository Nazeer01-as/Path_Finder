import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  BookOpen,
  Award,
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Search,
  Users
} from 'lucide-react';
import api from '../api/axios';
import OpportunityCard from '../components/cards/OpportunityCard';
import ExamCard from '../components/cards/ExamCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const Landing = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [oppsRes, examsRes] = await Promise.all([
          api.get('/opportunities?limit=3'),
          api.get('/exams?limit=3&sortBy=applicationLastDate')
        ]);
        setFeaturedOpportunities(oppsRes.data.data || []);
        setUpcomingExams(examsRes.data.data || []);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const stages = [
    {
      title: 'Class 10 Pass',
      badge: 'Foundational',
      color: 'from-blue-500 to-indigo-600',
      description: 'Intermediate (MPC, BiPC, CEC), 3-Year Polytechnic Diploma, ITI Trades, Vocational programs & Olympiads.',
      link: '/opportunities?educationLevel=Class 10'
    },
    {
      title: 'Intermediate / 11th–12th',
      badge: 'Crucial Gateway',
      color: 'from-indigo-600 to-purple-600',
      description: 'JEE, NEET, CLAT, CUET, NDA, Degree programs, B.Tech, Medicine, Law, Management & Central scholarships.',
      link: '/opportunities?educationLevel=Intermediate / 11th–12th'
    },
    {
      title: 'Diploma / Polytechnic',
      badge: 'Technical',
      color: 'from-cyan-500 to-blue-600',
      description: 'B.Tech Lateral Entry (ECET), Junior Engineer exams (RRB/SSC JE), industrial apprenticeships & DRDO/ISRO trainee jobs.',
      link: '/opportunities?educationLevel=Diploma / Polytechnic'
    },
    {
      title: 'ITI & Skilled Trades',
      badge: 'Hands-on Career',
      color: 'from-amber-500 to-orange-600',
      description: 'National Apprenticeship Promotion Scheme (NAPS), Railway Loco Pilot, Solar tech & direct industrial placements.',
      link: '/opportunities?educationLevel=ITI'
    },
    {
      title: 'Undergraduate & Degree',
      badge: 'Career Launchpad',
      color: 'from-emerald-500 to-teal-600',
      description: 'Internships, Google Summer of Code, UPSC CSE, Banking, SSC CGL, Corporate hiring & Higher Studies.',
      link: '/opportunities?educationLevel=Undergraduate'
    },
    {
      title: 'Competitive Exams',
      badge: 'All Levels',
      color: 'from-rose-500 to-pink-600',
      description: 'Central and State government recruitment, Defence services, Banking exams, and Research fellowships.',
      link: '/exams'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Comprehensive Opportunity & Career Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Your Next Step <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">
                Starts Right Here.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Discover education pathways, examinations, scholarships, courses, internships and career opportunities based on where you are today — from Class 10 to Higher Education.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/opportunities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all"
              >
                <Search className="w-4 h-4" />
                Explore Opportunities
              </Link>
              <Link
                to="/careers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-700 font-bold text-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                Find My Career Path
              </Link>
            </div>

            {/* Mini Trust Bar */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Official Websites
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Class 10 to Post-Graduation
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Smart Rule-Based Matching
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage-by-Stage Pathways Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Where Are You in Your Journey?
          </h2>
          <p className="text-sm text-slate-500">
            PathFinder does not stop at Intermediate or Diploma. Click your current level to discover everything available for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage, idx) => (
            <Link
              key={idx}
              to={stage.link}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {stage.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                  {stage.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
                Explore {stage.title} Options →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Pathway Roadmap Illustration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Interactive Pathway Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              From Class 10 to Your Dream Career
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every successful career follows a structured blueprint: Education → Entrance Examination → Professional Course → In-Demand Skills → Internship → Employment.
            </p>
          </div>

          {/* Step flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { step: '01', title: 'Education', desc: '10th, 12th, Diploma or Degree' },
              { step: '02', title: 'Entrance Exams', desc: 'JEE, NEET, CLAT, POLYCET, CAT' },
              { step: '03', title: 'Course', desc: 'B.Tech, MBBS, B.Sc, ITI, Law' },
              { step: '04', title: 'Key Skills', desc: 'Coding, Design, Clinical, Tools' },
              { step: '05', title: 'Internship', desc: 'DRDO, GSoC, NAPS, Corporate' },
              { step: '06', title: 'Dream Career', desc: 'AI Engineer, IAS, Doctor, Pilot' }
            ].map((node, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-black text-indigo-400 tracking-wider">
                    {node.step}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1 mb-1">
                    {node.title}
                  </h4>
                  <p className="text-xs text-slate-300">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:justify-start">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-lg transition-all"
            >
              Browse All Career Roadmaps
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Latest Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Opportunities & Fellowships
            </h2>
          </div>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            View All Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpportunities.map((opp) => (
              <OpportunityCard key={opp._id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Examinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Urgent Timelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Upcoming National & State Entrance Exams
            </h2>
          </div>
          <Link
            to="/exams"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            View All Examinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingExams.map((exam) => (
              <ExamCard key={exam._id} exam={exam} />
            ))}
          </div>
        )}
      </section>

      {/* Call to action for registration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Get Recommendations Tailored To You
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Create your free student profile in under 2 minutes. Enter your education level, stream, and interests to receive curated opportunities and deadline alerts.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 shadow-lg transition-all"
              >
                Create Student Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-500/30 hover:bg-indigo-500/50 text-white font-bold text-sm border border-white/20 transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
