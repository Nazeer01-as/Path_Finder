import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, IndianRupee, Sparkles, Building } from 'lucide-react';
import Badge from '../common/Badge';
import DeadlineBadge from '../common/DeadlineBadge';
import { useAuth } from '../../context/AuthContext';

const ScholarshipCard = ({ scholarship }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(scholarship._id);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark scholarships');
      return;
    }
    if (bookmarked) {
      await removeBookmark(scholarship._id);
    } else {
      await addBookmark('scholarship', scholarship._id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 p-6 flex flex-col justify-between relative">
      <div>
        {scholarship.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="truncate">{scholarship.matchReason}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="emerald">{scholarship.categoryCriteria || 'Scholarship'}</Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={scholarship.deadline} />
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Scholarship'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
          <Link to={`/scholarships/${scholarship._id}`}>{scholarship.name}</Link>
        </h3>

        {/* Provider */}
        <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          {scholarship.provider}
        </p>

        {/* Benefit Highlight Box */}
        <div className="bg-emerald-50/60 rounded-xl p-3 mb-3 border border-emerald-100/80">
          <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            Benefit: {scholarship.benefits}
          </div>
          <div className="text-xs text-slate-600 mt-1 line-clamp-1">
            <span className="font-semibold text-slate-800">Income: </span>
            {scholarship.incomeCriteria}
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {scholarship.description}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/scholarships/${scholarship._id}`}
          className="inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-200"
        >
          View Eligibility
        </Link>
        <a
          href={scholarship.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Official Portal
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ScholarshipCard;
