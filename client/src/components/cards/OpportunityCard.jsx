import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Building2, MapPin, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from '../common/DeadlineBadge';
import { useAuth } from '../../context/AuthContext';

const OpportunityCard = ({ opportunity }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(opportunity._id);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark opportunities');
      return;
    }
    if (bookmarked) {
      await removeBookmark(opportunity._id);
    } else {
      await addBookmark('opportunity', opportunity._id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-6 flex flex-col justify-between relative">
      <div>
        {/* Recommendation badge if present */}
        {opportunity.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">{opportunity.matchReason}</span>
          </div>
        )}

        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="cyan">{opportunity.category}</Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={opportunity.deadline} />
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1.5">
          <Link to={`/opportunities/${opportunity._id}`}>{opportunity.title}</Link>
        </h3>

        {/* Organization & Location */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {opportunity.organization}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {opportunity.location || 'All India'}
          </span>
        </div>

        {/* Eligibility Pill */}
        <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100">
          <p className="text-xs font-medium text-slate-700 line-clamp-2">
            <span className="font-semibold text-slate-900">Eligibility: </span>
            {opportunity.eligibility}
          </p>
        </div>

        {/* Short description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/opportunities/${opportunity._id}`}
          className="inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-200"
        >
          View Details
        </Link>
        <a
          href={opportunity.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Official Website
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default OpportunityCard;
