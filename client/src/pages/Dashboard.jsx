import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Bookmark,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  User,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Target,
  Zap,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import OpportunityCard from '../components/cards/OpportunityCard';
import ExamCard from '../components/cards/ExamCard';
import ScholarshipCard from '../components/cards/ScholarshipCard';
import CourseCard from '../components/cards/CourseCard';
import CareerCard from '../components/cards/CareerCard';
import { GridSkeleton } from '../components/common/LoadingSkeleton';

const Dashboard = () => {
  const { user, bookmarks } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opportunities');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/recommendations');
        setRecommendations(res.data.data);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Compute urgent deadlines (< 15 days) from recommended exams/scholarships
  const urgentItems = [];
  if (recommendations) {
    (recommendations.examinations || []).forEach((exam) => {
      if (exam.applicationLastDate) {
        const days = Math.ceil((new Date(exam.applicationLastDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days > 0 && days <= 15) {
          urgentItems.push({
            id: exam._id,
            title: exam.name,
            type: 'Exam Application',
            daysLeft: days,
            date: new Date(exam.applicationLastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            link: `/exams/${exam._id}`,
            badgeColor: 'bg-rose-950/70 text-rose-300 border border-rose-800/80'
          });
        }
      }
    });

    (recommendations.scholarships || []).forEach((sch) => {
      if (sch.deadline) {
        const days = Math.ceil((new Date(sch.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (days > 0 && days <= 15) {
          urgentItems.push({
            id: sch._id,
            title: sch.name,
            type: 'Scholarship Deadline',
            daysLeft: days,
            date: new Date(sch.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            link: `/scholarships/${sch._id}`,
            badgeColor: 'bg-amber-950/70 text-amber-300 border border-amber-800/80'
          });
        }
      }
    });

    urgentItems.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  // Profile readiness score calculation
  const calculateProfileScore = () => {
    let score = 30;
    if (user?.educationLevel) score += 20;
    if (user?.stream) score += 15;
    if (user?.skills && user.skills.length > 0) score += 20;
    if (user?.preferredCareers && user.preferredCareers.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const profileScore = calculateProfileScore();

  const statCards = [
    {
      title: 'Saved Opportunities',
      count: bookmarks.length,
      icon: Bookmark,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      gradient: 'from-rose-500/10 to-pink-500/10',
      link: '/saved',
      desc: 'Bookmarked for quick access'
    },
    {
      title: 'Recommended Matches',
      count: recommendations?.topRecommended?.length || recommendations?.opportunities?.length || 0,
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      gradient: 'from-amber-500/10 to-orange-500/10',
      link: '#recommendations',
      desc: 'Based on your profile'
    },
    {
      title: 'Target Examinations',
      count: recommendations?.examinations?.length || 0,
      icon: Award,
      color: 'text-orange-400 bg-orange-950/60 border-orange-800/60',
      gradient: 'from-orange-500/10 to-amber-500/10',
      link: '/exams',
      desc: 'Applicable entrance tests'
    },
    {
      title: 'Eligible Scholarships',
      count: recommendations?.scholarships?.length || 0,
      icon: BookOpen,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      link: '/scholarships',
      desc: 'Financial support schemes'
    }
  ];

  const quickActions = [
    { label: 'Explore Careers', icon: Briefcase, to: '/careers' },
    { label: 'Find Courses', icon: GraduationCap, to: '/courses' },
    { label: 'Search Scholarships', icon: BookOpen, to: '/scholarships' },
    { label: 'Explore Exams', icon: Award, to: '/exams' },
    { label: 'View Opportunities', icon: Search, to: '/opportunities' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-200">
      {/* Welcome Command Center Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-[#181512] to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-stone-800">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-800/60">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Student Command Center
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Curated intelligence matched to your current milestone:{' '}
              <span className="font-bold text-white px-2 py-0.5 rounded-lg bg-stone-800 border border-stone-700 inline-block my-1">
                {user?.educationLevel || 'Class 10 / Intermediate'}
              </span>{' '}
              {user?.stream && <span className="text-amber-400 font-semibold">({user.stream})</span>}.
            </p>

            {/* Profile Completion / Career Readiness Meter */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Profile Readiness Score
                </span>
                <span className="text-amber-300">{profileScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-all duration-700"
                  style={{ width: `${profileScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800/90 hover:bg-stone-700/90 text-stone-200 text-xs font-bold border border-stone-700 transition-all text-center"
            >
              <User className="w-4 h-4 text-amber-400" />
              Update Preferences & Skills
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all text-center"
            >
              <Compass className="w-4 h-4" />
              Explore Career Pathways
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Quick Discovery Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <Link
                key={i}
                to={qa.to}
                className="flex items-center gap-2.5 p-3 rounded-2xl border border-stone-800 bg-stone-900/80 hover:border-amber-500/60 hover:bg-stone-850 transition-all duration-200 hover:-translate-y-0.5 shadow-2xs group cursor-pointer text-stone-200"
              >
                <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform text-amber-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold truncate text-stone-200 group-hover:text-white">{qa.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4-Stage Pathway Progression */}
      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              PathFinder Journey Tracker
            </span>
            <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
              Your 4-Stage Pathway Progression
            </h3>
          </div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            Full Pathway Maps <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Node 1: Current Stage */}
          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-800/60">
                  Step 1 • Active
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider">Current Stage</h4>
              <p className="text-sm font-bold text-white mt-1">
                {user?.educationLevel || 'Class 10 / Intermediate'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {user?.stream ? `Stream: ${user.stream}` : 'Academic baseline locked'}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-stone-700/60 flex items-center text-[11px] font-bold text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> In Progress
            </div>
          </div>

          {/* Node 2: Next Skill */}
          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-800/60">
                  Step 2 • Milestone
                </span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider">Next Key Skill</h4>
              <p className="text-sm font-bold text-white mt-1">
                {user?.skills && user.skills.length > 0 ? user.skills[0] : 'Data Analysis & Programming'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Foundational competence for target exams
              </p>
            </div>
            <Link
              to="/courses"
              className="pt-3 mt-3 border-t border-stone-700/60 flex items-center text-[11px] font-bold text-amber-400 hover:text-amber-300"
            >
              Browse Recommended Courses →
            </Link>
          </div>

          {/* Node 3: Next Opportunity */}
          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-800/60">
                  Step 3 • Target
                </span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider">Next Gateway</h4>
              <p className="text-sm font-bold text-white mt-1">
                {recommendations?.examinations && recommendations.examinations.length > 0
                  ? recommendations.examinations[0].name
                  : 'National Entrance Gateway'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Qualify entrance to access premier programs
              </p>
            </div>
            <Link
              to="/exams"
              className="pt-3 mt-3 border-t border-stone-700/60 flex items-center text-[11px] font-bold text-amber-400 hover:text-amber-300"
            >
              Check Exam Dates & Syllabus →
            </Link>
          </div>

          {/* Node 4: Target Career */}
          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/60">
                  Step 4 • Destination
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider">Target Career</h4>
              <p className="text-sm font-bold text-white mt-1">
                {user?.preferredCareers && user.preferredCareers.length > 0
                  ? user.preferredCareers[0]
                  : recommendations?.careers && recommendations.careers.length > 0
                  ? recommendations.careers[0].title
                  : 'Systems Architect / Public Administrator'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Long-term high-growth trajectory
              </p>
            </div>
            <Link
              to="/careers"
              className="pt-3 mt-3 border-t border-stone-700/60 flex items-center text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
            >
              View Full Career Roadmap →
            </Link>
          </div>
        </div>
      </div>

      {/* Urgent Deadline Notification Strip */}
      {urgentItems.length > 0 && (
        <div className="bg-stone-900/90 border border-rose-900/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-950/40">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Urgent Deadlines Closing Soon</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    {urgentItems.length} Alert{urgentItems.length > 1 ? 's' : ''}
                  </span>
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Applications are closing within 15 days. Verify eligibility and submit your materials early.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {urgentItems.slice(0, 4).map((item, i) => (
              <div
                key={item.id || i}
                className="bg-stone-800/80 rounded-2xl p-3.5 border border-stone-700 flex items-center justify-between gap-3 shadow-2xs hover:border-rose-500/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                      {item.type}
                    </span>
                    <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-400" />
                      {item.daysLeft === 0 ? 'Closes Today!' : `Closes in ${item.daysLeft} days`}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                </div>
                <Link
                  to={item.link}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-800 transition-all"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.link}
              className="bg-stone-900/80 rounded-2xl border border-stone-800 p-5 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/50 hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden group text-stone-200"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.gradient} rounded-bl-full pointer-events-none`} />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-400">{stat.title}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.color} shadow-2xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.count}</p>
              </div>
              <p className="text-[11px] text-stone-500 mt-3 pt-3 border-t border-stone-800 flex items-center justify-between">
                <span>{stat.desc}</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recommendation Disclaimer Alert */}
      <div className="flex items-center gap-2.5 p-3.5 bg-amber-950/50 border border-amber-800/60 rounded-2xl text-xs text-amber-200 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Official Advisory:</strong> Recommendations are tailored to your profile inputs for structured exploration. Please always cross-verify dates, eligibility and fees on official conducting body portals.
        </span>
      </div>

      {/* Tabbed Recommendations Section */}
      <section id="recommendations" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Personalized Recommendation Stream
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Curated For Your Profile
            </h2>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900/90 rounded-2xl border border-stone-800 overflow-x-auto pb-1 sm:pb-1">
            {[
              { id: 'opportunities', label: 'Opportunities', icon: Sparkles },
              { id: 'exams', label: 'Exams', icon: Award },
              { id: 'scholarships', label: 'Scholarships', icon: BookOpen },
              { id: 'courses', label: 'Courses', icon: GraduationCap },
              { id: 'careers', label: 'Career Paths', icon: Briefcase }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content based on Active Tab */}
        {loading ? (
          <GridSkeleton count={3} />
        ) : (
          <div>
            {activeTab === 'opportunities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations?.opportunities || []).map((opp) => (
                  <OpportunityCard key={opp._id} opportunity={opp} />
                ))}
              </div>
            )}

            {activeTab === 'exams' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations?.examinations || []).map((exam) => (
                  <ExamCard key={exam._id} exam={exam} />
                ))}
              </div>
            )}

            {activeTab === 'scholarships' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations?.scholarships || []).map((sch) => (
                  <ScholarshipCard key={sch._id} scholarship={sch} />
                ))}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations?.courses || []).map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}

            {activeTab === 'careers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations?.careers || []).map((career) => (
                  <CareerCard key={career._id} career={career} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
