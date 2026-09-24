import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Calendar,
  IndianRupee,
  Clock,
  BookOpen,
  FileText,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/common/Badge';
import DeadlineBadge from '../components/common/DeadlineBadge';
import { useAuth } from '../context/AuthContext';

const ExamDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exams/${id}`);
        setExam(res.data.data);
      } catch (err) {
        console.error('Failed to load examination:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading examination details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Examination Not Found</h2>
        <Link to="/exams" className="text-indigo-600 font-bold text-sm">
          ← Return to Examinations
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(exam._id);

  const handleBookmarkToggle = async () => {
    if (!user) {
      alert('Please log in to save examinations');
      return;
    }
    if (bookmarked) {
      await removeBookmark(exam._id);
    } else {
      await addBookmark('exam', exam._id);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'To be announced';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/exams"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examinations Explorer
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="purple" size="md">
            {exam.category}
          </Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={exam.applicationLastDate} />
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
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save Exam
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title & Body */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {exam.name}
          </h1>
          <p className="text-sm font-bold text-indigo-600 mt-1 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Conducted by: {exam.conductingBody}
          </p>
        </div>

        {/* Important Dates Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Application Starts</p>
            <p className="font-bold text-slate-800 mt-0.5">{formatDate(exam.applicationStartDate)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Application Closes</p>
            <p className="font-bold text-rose-600 mt-0.5">{formatDate(exam.applicationLastDate)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Examination Date</p>
            <p className="font-bold text-indigo-700 mt-0.5">{formatDate(exam.examDate)}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            About the Examination
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            {exam.description}
          </p>
        </div>

        {/* Eligibility & Age Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Eligibility Criteria
            </h4>
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              {exam.eligibility}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Age Limit & Restrictions
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {exam.ageLimit}
            </p>
          </div>
        </div>

        {/* Fee & Exam Pattern */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <IndianRupee className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Application Fee</h4>
              <p className="text-xs text-slate-600 mt-0.5">{exam.fee}</p>
            </div>
          </div>

          {exam.examPattern && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Exam Pattern
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{exam.examPattern}</p>
            </div>
          )}

          {exam.syllabus && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Syllabus Outline
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{exam.syllabus}</p>
            </div>
          )}
        </div>

        {/* Important Links */}
        {exam.importantLinks && exam.importantLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Official Resources & Links
            </h4>
            <div className="flex flex-wrap gap-2">
              {exam.importantLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors"
                >
                  {link.title || 'Official Document'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Verify current dates & notification on the official portal before applying.</span>
          </div>

          <a
            href={exam.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all"
          >
            Visit Official Exam Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
