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
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-400 text-sm">Loading career pathway roadmap...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-100 mb-2">Career Roadmap Not Found</h2>
        <Link to="/careers" className="text-amber-400 hover:text-amber-300 font-bold text-sm">
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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Career Pathways
      </Link>

      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-10 shadow-xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="purple" size="md">
            {career.sector}
          </Badge>
          <button
            onClick={handleBookmarkToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              bookmarked
                ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-800/60'
            }`}
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-rose-400" />
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
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            {career.title}
          </h1>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            {career.description}
          </p>
        </div>

        {/* Salary & Growth Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-stone-800/40 rounded-2xl border border-stone-700/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Typical Compensation
            </span>
            <p className="text-lg font-black text-stone-100 mt-0.5">
              {career.averageSalaryRange}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Future Market Demand
            </span>
            <p className="text-lg font-black text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              {career.growthProspects}
            </p>
          </div>
        </div>

        {/* INTERACTIVE TIMELINE ROADMAP */}
        <div className="space-y-6 pt-4 border-t border-stone-800">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-md">
              Step-by-Step Trajectory
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Career Journey & Progression Roadmap
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Visual sequence of education, exams, and milestones required to reach this career.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-8 my-6">
            {(career.careerPath || []).map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon / indicator */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black ring-4 ring-stone-900 shadow-md">
                  {step.stepNumber}
                </div>

                <div className="bg-stone-800/50 hover:bg-stone-800/80 p-5 rounded-2xl border border-stone-700/60 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {step.title}
                    </h3>
                    {step.typicalDuration && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-900 text-amber-300 border border-amber-800/50">
                        {step.typicalDuration}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Skills & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Required Educational Foundations
            </h4>
            <ul className="space-y-2 text-xs">
              {(career.requiredEducation || []).map((edu, i) => (
                <li key={i} className="flex items-center gap-2 p-2.5 bg-stone-800/40 rounded-xl border border-stone-700/60 font-medium text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  {edu}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Essential Skills & Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {(career.requiredSkills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-950/30 text-amber-300 font-bold text-xs border border-amber-800/50">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Roles, Courses & Exams */}
        <div className="space-y-4 pt-4 border-t border-stone-800">
          {career.jobRoles && career.jobRoles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Typical Job Titles & Industry Roles:
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.jobRoles.map((role, idx) => (
                  <span key={idx} className="px-3 py-1 bg-stone-800 text-stone-300 border border-stone-700/60 rounded-lg text-xs font-semibold">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {career.relatedExams && career.relatedExams.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                Relevant Entrance & Competitive Examinations:
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.relatedExams.map((exam, idx) => (
                  <Link
                    key={idx}
                    to={`/exams?search=${encodeURIComponent(exam)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 text-purple-300 text-xs font-bold border border-purple-800/60 hover:bg-stone-700 transition-colors shadow-2xs"
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
