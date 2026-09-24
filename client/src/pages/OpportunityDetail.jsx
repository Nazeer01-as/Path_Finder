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
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Opportunity Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The opportunity you are looking for does not exist or was removed.</p>
        <Link to="/opportunities" className="text-indigo-600 font-bold text-sm">
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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunity Explorer
      </Link>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
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
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
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
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
          {opportunity.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600 border-y border-slate-100 py-3">
          <span className="flex items-center gap-1.5 font-bold text-slate-800">
            <Building2 className="w-4 h-4 text-indigo-500" />
            {opportunity.organization}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            {opportunity.location || 'All India / Online'}
          </span>
          {opportunity.opportunityType && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {opportunity.opportunityType}
            </span>
          )}
        </div>

        {/* Detailed Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            About This Opportunity
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility Details Box */}
        <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100 space-y-3">
          <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            Eligibility & Prerequisite Criteria
          </h3>
          <p className="text-sm text-indigo-900 leading-relaxed font-medium">
            {opportunity.eligibility}
          </p>
          {opportunity.educationLevels && opportunity.educationLevels.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-indigo-800 mr-1">Target Stages:</span>
              {opportunity.educationLevels.map((lvl, idx) => (
                <span key={idx} className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white text-indigo-700 border border-indigo-200">
                  {lvl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Topic Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.tags.map((tag, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply CTA Section */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Applications are processed directly through the official host platform.</span>
          </div>

          <a
            href={opportunity.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
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
