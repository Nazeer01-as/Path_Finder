import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Calendar,
  PlusCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      count: stats?.metrics?.totalStudents || 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      link: '/admin/users'
    },
    {
      title: 'Live Opportunities',
      count: stats?.metrics?.totalOpportunities || 0,
      icon: Sparkles,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      link: '/admin/opportunities'
    },
    {
      title: 'Examinations',
      count: stats?.metrics?.totalExaminations || 0,
      icon: Award,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      link: '/admin/exams'
    },
    {
      title: 'Scholarships',
      count: stats?.metrics?.totalScholarships || 0,
      icon: BookOpen,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      link: '/admin/scholarships'
    },
    {
      title: 'Courses',
      count: stats?.metrics?.totalCourses || 0,
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      link: '/admin/courses'
    },
    {
      title: 'Career Roadmaps',
      count: stats?.metrics?.totalCareers || 0,
      icon: Briefcase,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      link: '/admin/careers'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-md">
            Administration Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            System Overview & Database Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage real-time educational data, entrance examinations, scholarships, and registered users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/opportunities"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Content
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              to={c.link}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {c.title}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{c.count}</p>
            </Link>
          );
        })}
      </div>

      {/* Upcoming Deadlines Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exams closing soon */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Active Entrance Exams Deadlines
            </h3>
            <Link to="/admin/exams" className="text-xs font-bold text-purple-600 hover:underline">
              Manage Exams →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {(stats?.upcomingDeadlines?.exams || []).map((exam) => (
              <div key={exam._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{exam.name}</p>
                  <p className="text-slate-400">{exam.conductingBody}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold">
                    {new Date(exam.applicationLastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships closing soon */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Active Scholarship Deadlines
            </h3>
            <Link to="/admin/scholarships" className="text-xs font-bold text-emerald-600 hover:underline">
              Manage Scholarships →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {(stats?.upcomingDeadlines?.scholarships || []).map((sch) => (
              <div key={sch._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{sch.name}</p>
                  <p className="text-slate-400">{sch.provider}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                    {new Date(sch.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
