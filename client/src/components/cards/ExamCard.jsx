import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Calendar, Award, Sparkles, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from '../common/DeadlineBadge';
import { useAuth } from '../../context/AuthContext';

const ExamCard = ({ exam }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(exam._id);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark examinations');
      return;
    }
    setBookmarking(true);
    try {
      if (bookmarked) {
        await removeBookmark(exam._id);
      } else {
        await addBookmark('exam', exam._id);
      }
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="group bg-stone-900/80 rounded-2xl border border-stone-800 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden text-stone-200">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {exam.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{exam.matchReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="amber" dot>{exam.category}</Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={exam.applicationLastDate} />
            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarking}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                bookmarked
                  ? 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-xs shadow-rose-950/20'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-800'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Examination'}
              aria-label={bookmarked ? 'Remove Bookmark' : 'Save Examination'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-rose-500 text-rose-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-1.5 leading-snug">
          <Link to={`/exams/${exam._id}`}>{exam.name}</Link>
        </h3>

        <p className="text-xs font-bold text-amber-400 mb-3.5 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="line-clamp-1">{exam.conductingBody}</span>
        </p>

        {/* Key Details Box */}
        <div className="bg-stone-800/70 rounded-xl p-3 mb-3.5 border border-stone-700/80 space-y-2 text-xs text-stone-300">
          <div>
            <span className="font-bold text-white">Eligibility: </span>
            <span className="line-clamp-1 font-medium">{exam.eligibility}</span>
          </div>
          {exam.examDate && (
            <div className="flex items-center gap-1.5 text-stone-200 font-semibold pt-1 border-t border-stone-700/60">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Exam Date: {new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-stone-400 line-clamp-2 mb-4 leading-relaxed font-normal">
          {exam.description}
        </p>
      </div>

      <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/exams/${exam._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-amber-950/60 text-amber-300 hover:bg-amber-500 hover:text-stone-950 border border-amber-800/60 transition-all duration-200 group-hover:shadow-sm"
        >
          <span>Exam Details & Syllabus</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {exam.officialWebsite && (
          <a
            href={exam.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 px-3 py-2 rounded-xl hover:bg-stone-800 transition-colors"
          >
            Official Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
