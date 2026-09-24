import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, TrendingUp, Sparkles, Compass, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const CareerCard = ({ career }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(career._id);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark career pathways');
      return;
    }
    if (bookmarked) {
      await removeBookmark(career._id);
    } else {
      await addBookmark('career', career._id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-6 flex flex-col justify-between relative">
      <div>
        {career.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">{career.matchReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="purple">{career.sector}</Badge>
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl border transition-all ${
              bookmarked
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Save Career'}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          <Link to={`/careers/${career._id}`}>{career.title}</Link>
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {career.description}
        </p>

        {/* Growth & Salary info */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Salary Range</p>
            <p className="text-xs font-bold text-slate-800 line-clamp-1">{career.averageSalaryRange}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Prospects</p>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {career.growthProspects}
            </p>
          </div>
        </div>

        {/* Roadmap Preview Steps */}
        {career.careerPath && career.careerPath.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Pathway Roadmap:</p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {career.careerPath.slice(0, 3).map((step, idx) => (
                <React.Fragment key={idx}>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-medium text-[11px]">
                    {step.title}
                  </span>
                  {idx < Math.min(career.careerPath.length - 1, 2) && (
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
              {career.careerPath.length > 3 && (
                <span className="text-[11px] text-slate-400 font-medium">
                  +{career.careerPath.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/careers/${career._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-200"
        >
          <Compass className="w-4 h-4" />
          Explore Interactive Pathway
        </Link>
      </div>
    </div>
  );
};

export default CareerCard;
