import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, IndianRupee, Sparkles, Building, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from '../common/DeadlineBadge';
import { useAuth } from '../../context/AuthContext';

const ScholarshipCard = ({ scholarship }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(scholarship._id);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark scholarships');
      return;
    }
    setBookmarking(true);
    try {
      if (bookmarked) {
        await removeBookmark(scholarship._id);
      } else {
        await addBookmark('scholarship', scholarship._id);
      }
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="group bg-stone-900/80 rounded-2xl border border-stone-800 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden text-stone-200">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {scholarship.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
            <span className="truncate">{scholarship.matchReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="emerald" dot>{scholarship.categoryCriteria || 'Scholarship'}</Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={scholarship.deadline} />
            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarking}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                bookmarked
                  ? 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-xs shadow-rose-950/20'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-800'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Scholarship'}
              aria-label={bookmarked ? 'Remove Bookmark' : 'Save Scholarship'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-rose-500 text-rose-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5 leading-snug">
          <Link to={`/scholarships/${scholarship._id}`}>{scholarship.name}</Link>
        </h3>

        <p className="text-xs font-semibold text-stone-400 mb-3.5 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="line-clamp-1">{scholarship.provider}</span>
        </p>

        {/* Benefit Highlight Box */}
        <div className="bg-stone-800/70 rounded-xl p-3 mb-3.5 border border-stone-700/80">
          <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Benefit: {scholarship.benefits}</span>
          </div>
          {scholarship.incomeCriteria && (
            <div className="text-xs text-stone-300 mt-1 line-clamp-1 font-medium">
              <span className="font-bold text-white">Income Criteria: </span>
              {scholarship.incomeCriteria}
            </div>
          )}
        </div>

        <p className="text-sm text-stone-400 line-clamp-2 mb-4 leading-relaxed font-normal">
          {scholarship.description}
        </p>
      </div>

      <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/scholarships/${scholarship._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-950/60 text-emerald-300 hover:bg-emerald-500 hover:text-stone-950 border border-emerald-800/60 transition-all duration-200 group-hover:shadow-sm"
        >
          <span>View Eligibility</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {scholarship.officialWebsite && (
          <a
            href={scholarship.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-emerald-400 px-3 py-2 rounded-xl hover:bg-stone-800 transition-colors"
          >
            Official Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ScholarshipCard;
