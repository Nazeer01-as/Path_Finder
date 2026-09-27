import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  Share2,
  CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/common/Badge';
import DeadlineBadge from '../components/common/DeadlineBadge';
import { useAuth } from '../context/AuthContext';

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await api.get(`/opportunities/${id}`);
        setOpportunity(res.data.data);
      } catch (err) {
        console.error('Failed to load opportunity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-400 text-sm">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-100 mb-2">Opportunity Not Found</h2>
        <p className="text-sm text-stone-400 mb-6">The opportunity you are looking for does not exist or was removed.</p>
        <Link to="/opportunities" className="text-amber-400 hover:text-amber-300 font-bold text-sm">
          ← Return to Opportunities
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(opportunity._id);

  const handleBookmarkToggle = async () => {
    if (!user) {
      alert('Please log in to save opportunities');
      return;
    }
    if (bookmarked) {
      await removeBookmark(opportunity._id);
    } else {
      await addBookmark('opportunity', opportunity._id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunity Explorer
      </Link>

      {/* Main Detail Header Card */}
      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="cyan" size="md">
            {opportunity.category}
          </Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={opportunity.deadline} />
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
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
          {opportunity.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-stone-300 border-y border-stone-800/80 py-3">
          <span className="flex items-center gap-1.5 font-bold text-stone-100">
            <Building2 className="w-4 h-4 text-amber-400" />
            {opportunity.organization}
          </span>
          <span className="flex items-center gap-1.5 text-stone-400">
            <MapPin className="w-4 h-4 text-stone-500" />
            {opportunity.location || 'All India / Online'}
          </span>
          {opportunity.opportunityType && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700/60">
              {opportunity.opportunityType}
            </span>
          )}
        </div>

        {/* Detailed Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
            About This Opportunity
          </h3>
          <p className="text-stone-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility Details Box */}
        <div className="bg-amber-950/20 rounded-2xl p-5 border border-amber-800/40 space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Eligibility & Prerequisite Criteria
          </h3>
          <p className="text-sm text-stone-200 leading-relaxed font-medium">
            {opportunity.eligibility}
          </p>
          {opportunity.educationLevels && opportunity.educationLevels.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-300/80 mr-1">Target Stages:</span>
              {opportunity.educationLevels.map((lvl, idx) => (
                <span key={idx} className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-stone-800 text-amber-300 border border-stone-700">
                  {lvl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Topic Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.tags.map((tag, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700/60">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply CTA Section */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Applications are processed directly through the official host platform.</span>
          </div>

          <a
            href={opportunity.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Apply on Official Website
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
