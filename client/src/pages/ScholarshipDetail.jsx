import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  IndianRupee,
  FileCheck,
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/common/Badge';
import DeadlineBadge from '../components/common/DeadlineBadge';
import { useAuth } from '../context/AuthContext';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await api.get(`/scholarships/${id}`);
        setScholarship(res.data.data);
      } catch (err) {
        console.error('Failed to load scholarship:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-400 text-sm">Loading scholarship details...</p>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-100 mb-2">Scholarship Not Found</h2>
        <Link to="/scholarships" className="text-amber-400 hover:text-amber-300 font-bold text-sm">
          ← Return to Scholarships
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(scholarship._id);

  const handleBookmarkToggle = async () => {
    if (!user) {
      alert('Please log in to save scholarships');
      return;
    }
    if (bookmarked) {
      await removeBookmark(scholarship._id);
    } else {
      await addBookmark('scholarship', scholarship._id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/scholarships"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Scholarships Explorer
      </Link>

      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-10 shadow-xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="emerald" size="md">
            {scholarship.categoryCriteria || 'Scholarship Scheme'}
          </Badge>
          <div className="flex items-center gap-2">
            <DeadlineBadge deadline={scholarship.deadline} />
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
                  Save Scholarship
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            {scholarship.name}
          </h1>
          <p className="text-sm font-semibold text-stone-300 mt-1 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-emerald-400" />
            Provided by: {scholarship.provider}
          </p>
        </div>

        {/* Benefits & Financial Value Callout */}
        <div className="bg-emerald-950/20 rounded-2xl p-6 border border-emerald-800/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            Financial Benefit & Grant
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-300">
            {scholarship.benefits}
          </p>
          <p className="text-xs text-stone-300 font-medium pt-1">
            <strong className="text-white">Income Criteria: </strong>{scholarship.incomeCriteria}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
            About the Scholarship
          </h3>
          <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
            {scholarship.description}
          </p>
        </div>

        {/* Eligibility Requirements */}
        <div className="bg-stone-800/40 rounded-2xl p-5 border border-stone-700/60 space-y-3">
          <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Eligibility Criteria
          </h3>
          <p className="text-sm text-stone-300 font-medium leading-relaxed">
            {scholarship.eligibility}
          </p>
          {scholarship.educationLevels && scholarship.educationLevels.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-400 mr-1">Applicable Stages:</span>
              {scholarship.educationLevels.map((lvl, idx) => (
                <span key={idx} className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-stone-800 text-emerald-300 border border-emerald-800/50">
                  {lvl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Required Documents List */}
        {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              Required Documents Checklist
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scholarship.requiredDocuments.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 p-3 rounded-xl bg-stone-800/50 border border-stone-700/60 text-xs font-medium text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Process */}
        {scholarship.applicationProcess && (
          <div className="p-5 bg-stone-800/40 rounded-2xl border border-stone-700/60 space-y-1.5 text-xs text-stone-300">
            <h4 className="font-bold text-stone-200 text-sm">Application Procedure:</h4>
            <p className="leading-relaxed">{scholarship.applicationProcess}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Apply exclusively on official government or institutional scholarship portals.</span>
          </div>

          <a
            href={scholarship.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Apply on Official Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
