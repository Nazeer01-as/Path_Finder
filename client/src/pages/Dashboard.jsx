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
  ExternalLink,
  ShieldAlert
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
            title: exam.name,
            type: 'Exam Application',
            daysLeft: days,
            link: `/exams/${exam._id}`
          });
        }
      }
    });

    (recommendations.scholarships || []).forEach((sch) => {
      if (sch.deadline) {
        const days = Math.ceil((new Date(sch.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (days > 0 && days <= 15) {
          urgentItems.push({
            title: sch.name,
            type: 'Scholarship Deadline',
            daysLeft: days,
            link: `/scholarships/${sch._id}`
          });
        }
      }
    });
  }

  const statCards = [
    {
      title: 'Recommended Match',
      count: recommendations?.topRecommended?.length || 0,
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      link: '#recommendations'
    },
    {
      title: 'Target Examinations',
      count: recommendations?.examinations?.length || 0,
      icon: Award,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      link: '/exams'
    },
    {
      title: 'Eligible Scholarships',
      count: recommendations?.scholarships?.length || 0,
      icon: BookOpen,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      link: '/scholarships'
    },
    {
      title: 'Saved Opportunities',
      count: bookmarks.length,
      icon: Bookmark,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      link: '/saved'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-indigo-100">
            <Compass className="w-3.5 h-3.5" />
            PathFinder Student Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl leading-relaxed">
            Here are curated opportunities, exams, scholarships, and pathways matched to your profile:
            <span className="font-bold text-white"> {user?.educationLevel || 'Class 10 / Intermediate'} </span>
            {user?.stream && <span>({user.stream})</span>}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all"
          >
            <User className="w-4 h-4" />
            Update Preferences
          </Link>
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-md transition-all"
          >
            <Compass className="w-4 h-4" />
            Explore Pathways
          </Link>
        </div>
      </div>

      {/* Urgent Deadline Notification Strip */}
      {urgentItems.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Urgent Application Deadlines Closing Soon:
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                {urgentItems[0].title} — {urgentItems[0].type} closes in{' '}
                <strong className="underline">{urgentItems[0].daysLeft} day{urgentItems[0].daysLeft === 1 ? '' : 's'}</strong>!
              </p>
            </div>
          </div>
          <Link
            to={urgentItems[0].link}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            View Deadline
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{stat.title}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{stat.count}</p>
            </Link>
          );
        })}
      </div>

      {/* Recommendation Disclaimer Alert */}
      <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Notice:</strong> Recommendations are generated by our matching engine based on your profile inputs. They are for exploration and do not constitute official admission guarantees. Always verify details on official sites.
        </span>
      </div>

      {/* Tabbed Recommendations Section */}
      <section id="recommendations" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Personalized Stream
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recommended For Your Profile
            </h2>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
