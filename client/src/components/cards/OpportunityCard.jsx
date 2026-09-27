import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Building2, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from '../common/DeadlineBadge';
import { useAuth } from '../../context/AuthContext';

const OpportunityCard = ({ opportunity }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(opportunity._id);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark opportunities');
      return;
    }
    setBookmarking(true);
    try {
      if (bookmarked) {
        await removeBookmark(opportunity._id);
      } else {
        await addBookmark('opportunity', opportunity._id);
      }
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="group bg-stone-900/80 rounded-2xl border border-stone-800 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden text-stone-200">
      {/* Subtle top gradient accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Recommendation explanation badge if present */}
        {opportunity.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{opportunity.matchReason}</span>
          </div>
        )}

        {/* Top Badges & Bookmark Action */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="amber" dot>{opportunity.category}</Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={opportunity.deadline} />
            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarking}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                bookmarked
                  ? 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-xs shadow-rose-950/20'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-800'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
              aria-label={bookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-rose-500 text-rose-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/opportunities/${opportunity._id}`}>{opportunity.title}</Link>
        </h3>

        {/* Organization & Location Meta */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3.5 text-xs text-stone-400 mb-3.5">
          <span className="flex items-center gap-1 font-semibold text-stone-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            {opportunity.organization}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            {opportunity.location || 'All India'}
          </span>
        </div>

        {/* Eligibility Pill */}
        <div className="bg-stone-800/70 rounded-xl p-3 mb-3.5 border border-stone-700/80 text-xs">
          <p className="font-medium text-stone-300 line-clamp-2 leading-relaxed">
            <span className="font-bold text-white">Eligibility: </span>
            {opportunity.eligibility}
          </p>
        </div>

        {/* Short description */}
        <p className="text-sm text-stone-400 line-clamp-2 mb-4 leading-relaxed font-normal">
          {opportunity.description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/opportunities/${opportunity._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-amber-950/60 text-amber-300 hover:bg-amber-500 hover:text-stone-950 border border-amber-800/60 transition-all duration-200 group-hover:shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {opportunity.officialWebsite && (
          <a
            href={opportunity.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 px-3 py-2 rounded-xl hover:bg-stone-800 transition-colors"
          >
            Official Website
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
