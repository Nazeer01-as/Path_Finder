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
  Users,
  Target,
  Zap,
  Globe,
  Flame,
  FileCheck2,
  ChevronRight,
  Layers,
  MapPin
} from 'lucide-react';
import api from '../api/axios';
import OpportunityCard from '../components/cards/OpportunityCard';
import ExamCard from '../components/cards/ExamCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import CareerUniverse3D from '../components/visualizations/CareerUniverse3D';
import CareerJourneyPath from '../components/visualizations/CareerJourneyPath';

const Landing = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPathwayTab, setSelectedPathwayTab] = useState('all');

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

  const pathwayPreviews = {
    all: {
      tag: 'Multi-Branch Compass',
      title: 'Every Route Mapped to Your Potential',
      desc: 'From Class 10 fundamentals to executive careers, discover examinations, scholarships, and skill tracks tailored to you.'
    },
    education: {
      tag: 'Academic Bedrock',
      title: 'Higher Education & Degree Pathways',
      desc: 'Central & State Universities, 3-year Polytechnic Diplomas, Engineering (B.Tech), Medical, and Vocational ITI.'
    },
    skills: {
      tag: 'Industry Readiness',
      title: 'In-Demand Modern Competencies',
      desc: 'Data Science, Applied AI, Electronics, Mechanical CAD, Coding, and Quantitative Aptitude.'
    },
    exams: {
      tag: 'National Gateways',
      title: 'Standardized Entrance & Recruitment Exams',
      desc: 'JEE, NEET, GATE, UPSC, NDA, CUET, and State Public Service Commissions.'
    },
    opportunities: {
      tag: 'Funded Programs',
      title: 'Fellowships, Grants & Apprenticeships',
      desc: 'ISRO Yuvika, NAPS national apprenticeships, Google Summer of Code, and corporate traineeships.'
    },
    career: {
      tag: 'Target Horizons',
      title: 'High-Impact Dream Professions',
      desc: 'Systems Architect, Civil Services Officer, Aeronautical Engineer, Biotech Researcher, and Financial Analyst.'
    }
  };

  const stages = [
    {
      title: 'Class 10 Pass',
      badge: 'Foundational',
      description: 'Intermediate (MPC, BiPC, CEC), 3-Year Polytechnic Diploma, ITI Trades, Vocational programs & Olympiads.',
      link: '/opportunities?educationLevel=Class 10'
    },
    {
      title: 'Intermediate / 11th–12th',
      badge: 'Crucial Gateway',
      description: 'JEE, NEET, CLAT, CUET, NDA, Degree programs, B.Tech, Medicine, Law, Management & Central scholarships.',
      link: '/opportunities?educationLevel=Intermediate / 11th–12th'
    },
    {
      title: 'Diploma / Polytechnic',
      badge: 'Technical Mastery',
      description: 'B.Tech Lateral Entry (ECET), Junior Engineer exams (RRB/SSC JE), industrial apprenticeships & DRDO/ISRO trainee jobs.',
      link: '/opportunities?educationLevel=Diploma / Polytechnic'
    },
    {
      title: 'ITI & Skilled Trades',
      badge: 'Hands-on Career',
      description: 'National Apprenticeship Promotion Scheme (NAPS), Railway Loco Pilot, Solar tech & direct industrial placements.',
      link: '/opportunities?educationLevel=ITI'
    },
    {
      title: 'Undergraduate & Degree',
      badge: 'Career Launchpad',
      description: 'Internships, Google Summer of Code, UPSC CSE, Banking, SSC CGL, Corporate hiring & Higher Studies.',
      link: '/opportunities?educationLevel=Undergraduate'
    },
    {
      title: 'Competitive Exams',
      badge: 'National Gateways',
      description: 'Central and State government recruitment, Defence services, Banking exams, and Research fellowships.',
      link: '/exams'
    }
  ];

  const valueProps = [
    {
      icon: Target,
      title: 'Multi-Path Matching Engine',
      description: 'Algorithms automatically filter exams, scholarships, and opportunities based on your exact education stage and ambitions.'
    },
    {
      icon: ShieldCheck,
      title: '100% Verified Official Portals',
      description: 'Direct links strictly pointing to government portals, official examination boards, and verified corporate sponsors.'
    },
    {
      icon: Clock,
      title: 'Deadline & Urgency Radar',
      description: 'Visual countdown indicators and urgency flags ensure you never miss critical application eligibility windows.'
    },
    {
      icon: TrendingUp,
      title: 'End-to-End Progression Chains',
      description: 'Understand every link from initial schooling through intermediate exams, higher degrees, and target job growth.'
    }
  ];

  return (
    <div className="space-y-24 pb-24 overflow-hidden bg-[#0b0b0a] text-stone-100">

      {/* ===================================================================== */}
      {/* LAYERED 3D CINEMATIC HERO SECTION                                    */}
      {/* Dark Graphite Environment + Warm Golden Horizon Light + Branching 3D Paths */}
      {/* ===================================================================== */}
      <section className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden border-b border-stone-800/80">
        {/* Layer 1 to 7: Three.js Interactive 3D WebGL Canvas */}
        <CareerUniverse3D
          activePathway={selectedPathwayTab}
          onSelectPathway={setSelectedPathwayTab}
        />

        {/* Cinematic Vignette Overlays: Blends scene seamlessly into page */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a] via-transparent to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0a]/60 via-transparent to-[#0b0b0a]/80 pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0b0a] to-transparent pointer-events-none z-10" />

        {/* Real Accessible HTML Content Layer Above 3D Canvas */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center space-y-6 pointer-events-auto">

          {/* Compass Identity Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-lg shadow-amber-950/50 border border-amber-800/60 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>PathFinder Career Universe • Multiple Branching Pathways</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Find Your Path.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 drop-shadow-sm">
              Build Your Future.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-300 leading-relaxed font-normal max-w-2xl mx-auto drop-shadow-sm">
            Explore careers, courses, exams, scholarships and opportunities personalized to your journey. Where you stand today is just the beginning.
          </p>

          {/* Interactive Pathway Quick-Selector Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {[
              { id: 'all', label: 'All Horizons', icon: Compass },
              { id: 'education', label: 'Higher Education', icon: GraduationCap },
              { id: 'skills', label: 'In-Demand Skills', icon: Sparkles },
              { id: 'exams', label: 'Gateway Exams', icon: Award },
              { id: 'opportunities', label: 'Opportunities', icon: Search },
              { id: 'career', label: 'Dream Careers', icon: Briefcase }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedPathwayTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPathwayTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 backdrop-blur-md cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 scale-105'
                      : 'bg-stone-900/70 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contextual Interactive Pathway Preview Card */}
          {selectedPathwayTab !== 'all' && (
            <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-stone-900/80 border border-amber-800/50 shadow-xl backdrop-blur-md text-left transition-all animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-600/30">
                  {pathwayPreviews[selectedPathwayTab].tag}
                </span>
                <span className="text-xs font-bold text-white">
                  {pathwayPreviews[selectedPathwayTab].title}
                </span>
              </div>
              <p className="text-2xs sm:text-xs text-stone-300">
                {pathwayPreviews[selectedPathwayTab].desc}
              </p>
            </div>
          )}

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/opportunities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-stone-950 font-black text-sm hover:from-amber-400 hover:to-orange-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Explore Your Path
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/careers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-stone-900/90 text-stone-200 font-bold text-sm border border-stone-700/80 hover:bg-stone-800 hover:border-amber-500/60 shadow-md backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              Discover Opportunities
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs text-stone-400 border-t border-stone-800/80">
            <span className="flex items-center gap-1.5 font-semibold text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              500+ Verified Official Portals
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              Class 10 to Higher Degree
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              AI-Calibrated Matching Engine
            </span>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2: Stage-by-Stage Educational Navigation                      */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/50">
            Education Pathways
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Where Are You in Your Educational Journey?
          </h2>
          <p className="text-sm text-stone-400">
            PathFinder does not stop at high school. Select your current academic stage to discover every relevant exam, course, scholarship, and career opportunity available for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage, idx) => (
            <Link
              key={idx}
              to={stage.link}
              className="group bg-stone-900/70 rounded-2xl border border-stone-800 p-6 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg">
                    {stage.badge}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-stone-800 group-hover:bg-amber-950 flex items-center justify-center text-stone-400 group-hover:text-amber-400 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                  {stage.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-normal">
                  {stage.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-stone-800 flex items-center text-xs font-bold text-amber-400 group-hover:text-amber-300">
                Explore {stage.title} Options →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 3: Interactive 5-Stage Career Path Visualizer Component        */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CareerJourneyPath />
      </section>

      {/* ===================================================================== */}
      {/* SECTION 4: Featured Opportunities Section                             */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/50">
              Verified Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Featured Opportunities & Fellowships
            </h2>
          </div>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 px-4 py-2 rounded-xl border border-amber-800/60 transition-all"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-4 h-4" />
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

      {/* ===================================================================== */}
      {/* SECTION 5: Upcoming Entrance Examinations                             */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800/50">
              Timely Deadlines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Upcoming National & State Entrance Exams
            </h2>
          </div>
          <Link
            to="/exams"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-300 hover:text-orange-200 bg-orange-950/60 hover:bg-orange-900/60 px-4 py-2 rounded-xl border border-orange-800/60 transition-all"
          >
            <span>View All Examinations</span>
            <ArrowRight className="w-4 h-4" />
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

      {/* ===================================================================== */}
      {/* SECTION 6: Why PathFinder - Core Value Propositions                   */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/50">
            Why PathFinder
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Designed To Eliminate Confusion In Career Choices
          </h2>
          <p className="text-sm text-stone-400">
            Instead of searching through hundreds of scattered blogs and expired links, PathFinder aggregates verified student pathways in one reliable place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-stone-900/70 rounded-2xl border border-stone-800 p-6 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-950/60 text-amber-400 flex items-center justify-center mb-4 border border-amber-800/50 shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 7: Final High-Impact CTA                                     */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-[#14120e] via-[#1f1a14] to-[#14120e] rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden border border-amber-800/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Start Your Personalized Pathway
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Ready To Discover What’s Next For You?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Create your free student profile in under 2 minutes. Enter your education level, stream, and target interests to receive tailored alerts and recommendations.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-stone-950 font-black text-sm hover:from-amber-400 hover:to-orange-500 shadow-xl shadow-amber-950/50 transition-all hover:scale-105"
              >
                Create Student Account
              </Link>
              <Link
                to="/opportunities"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-stone-900/80 hover:bg-stone-800/90 text-stone-200 font-bold text-sm border border-stone-700/80 backdrop-blur-md transition-all"
              >
                Browse Without Login
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
