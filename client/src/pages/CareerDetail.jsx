import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  ArrowDown,
  BookOpen,
  Award,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  GraduationCap
} from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await api.get(`/careers/${id}`);
        setCareer(res.data.data);
      } catch (err) {
        console.error('Failed to load career:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading career pathway roadmap...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Career Roadmap Not Found</h2>
        <Link to="/careers" className="text-indigo-600 font-bold text-sm">
          ← Return to Career Paths
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(career._id);

  const handleBookmarkToggle = async () => {
    if (!user) {
      alert('Please log in to save career pathways');
      return;
    }
    if (bookmarked) {
      await removeBookmark(career._id);
    } else {
      await addBookmark('career', career._id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Career Pathways
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="purple" size="md">
            {career.sector}
          </Badge>
          <button
            onClick={handleBookmarkToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              bookmarked
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-rose-600" />
                Saved Roadmap
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                Save Roadmap
              </>
            )}
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {career.title}
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {career.description}
          </p>
        </div>

        {/* Salary & Growth Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Typical Compensation
            </span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {career.averageSalaryRange}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Future Market Demand
            </span>
            <p className="text-lg font-black text-emerald-600 mt-0.5 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              {career.growthProspects}
            </p>
          </div>
        </div>

        {/* INTERACTIVE TIMELINE ROADMAP */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
              Step-by-Step Trajectory
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Career Journey & Progression Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Visual sequence of education, exams, and milestones required to reach this career.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-8 my-6">
            {(career.careerPath || []).map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon / indicator */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black ring-4 ring-white shadow-md">
                  {step.stepNumber}
                </div>

                <div className="bg-slate-50/80 hover:bg-indigo-50/40 p-5 rounded-2xl border border-slate-200/80 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {step.title}
                    </h3>
                    {step.typicalDuration && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-indigo-700 border border-indigo-200">
                        {step.typicalDuration}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Skills & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Educational Foundations
            </h4>
            <ul className="space-y-2 text-xs">
              {(career.requiredEducation || []).map((edu, i) => (
                <li key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  {edu}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Essential Skills & Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {(career.requiredSkills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Roles, Courses & Exams */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {career.jobRoles && career.jobRoles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Typical Job Titles & Industry Roles:
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.jobRoles.map((role, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {career.relatedExams && career.relatedExams.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
                Relevant Entrance & Competitive Examinations:
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.relatedExams.map((exam, idx) => (
                  <Link
                    key={idx}
                    to={`/exams?search=${encodeURIComponent(exam)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {exam} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDetail;
