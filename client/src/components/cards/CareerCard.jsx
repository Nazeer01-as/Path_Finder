import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, TrendingUp, Sparkles, Compass, ArrowRight, IndianRupee } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const CareerCard = ({ career }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(career._id);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark career pathways');
      return;
    }
    setBookmarking(true);
    try {
      if (bookmarked) {
        await removeBookmark(career._id);
      } else {
        await addBookmark('career', career._id);
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
        {career.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{career.matchReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="amber" dot>{career.sector}</Badge>
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarking}
            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
              bookmarked
                ? 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-xs shadow-rose-950/20'
                : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-800'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Save Career'}
            aria-label={bookmarked ? 'Remove Bookmark' : 'Save Career'}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-rose-500 text-rose-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/careers/${career._id}`}>{career.title}</Link>
        </h3>

        <p className="text-sm text-stone-400 line-clamp-2 mb-4 leading-relaxed font-normal">
          {career.description}
        </p>

        {/* Growth & Salary info */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-amber-400" />
              Salary Range
            </p>
            <p className="text-xs font-bold text-stone-200 line-clamp-1 mt-0.5">{career.averageSalaryRange}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Prospects</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{career.growthProspects}</span>
            </p>
          </div>
        </div>

        {/* Roadmap Preview Steps */}
        {career.careerPath && career.careerPath.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Pathway Roadmap:
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {career.careerPath.slice(0, 3).map((step, idx) => (
                <React.Fragment key={idx}>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-semibold text-[11px] border border-stone-700">
                    {step.title}
                  </span>
                  {idx < Math.min(career.careerPath.length - 1, 2) && (
                    <ArrowRight className="w-3 h-3 text-stone-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
              {career.careerPath.length > 3 && (
                <span className="text-[11px] text-stone-500 font-bold px-1.5">
                  +{career.careerPath.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/careers/${career._id}`}
          className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-amber-950/60 text-amber-300 hover:bg-amber-500 hover:text-stone-950 border border-amber-800/60 transition-all duration-200 group-hover:shadow-sm"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Interactive Pathway</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CareerCard;
