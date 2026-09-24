import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Calendar, Award, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from '../common/DeadlineBadge';
import { useAuth } from '../../context/AuthContext';

const ExamCard = ({ exam }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(exam._id);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark examinations');
      return;
    }
    if (bookmarked) {
      await removeBookmark(exam._id);
    } else {
      await addBookmark('exam', exam._id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-6 flex flex-col justify-between relative">
      <div>
        {/* Recommendation explanation */}
        {exam.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">{exam.matchReason}</span>
          </div>
        )}

        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="purple">{exam.category}</Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={exam.applicationLastDate} />
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Examination'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
          <Link to={`/exams/${exam._id}`}>{exam.name}</Link>
        </h3>

        {/* Conducting Body */}
        <p className="text-xs font-semibold text-indigo-600 mb-3 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          {exam.conductingBody}
        </p>

        {/* Key Details Box */}
        <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-800">Eligibility: </span>
            <span className="line-clamp-1">{exam.eligibility}</span>
          </div>
          {exam.examDate && (
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                Exam Date: {new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {exam.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/exams/${exam._id}`}
          className="inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-200"
        >
          Exam Details & Syllabus
        </Link>
        <a
          href={exam.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Official Portal
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ExamCard;
