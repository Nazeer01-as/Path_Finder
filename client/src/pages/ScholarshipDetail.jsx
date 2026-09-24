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
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading scholarship details...</p>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Scholarship Not Found</h2>
        <Link to="/scholarships" className="text-indigo-600 font-bold text-sm">
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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Scholarships Explorer
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
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
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
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
                  Save Scholarship
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {scholarship.name}
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-emerald-600" />
            Provided by: {scholarship.provider}
          </p>
        </div>

        {/* Benefits & Financial Value Callout */}
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            Financial Benefit & Grant
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-950">
            {scholarship.benefits}
          </p>
          <p className="text-xs text-emerald-800 font-medium pt-1">
            <strong>Income Criteria: </strong>{scholarship.incomeCriteria}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            About the Scholarship
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            {scholarship.description}
          </p>
        </div>

        {/* Eligibility Requirements */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Eligibility Criteria
          </h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {scholarship.eligibility}
          </p>
          {scholarship.educationLevels && scholarship.educationLevels.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 mr-1">Applicable Stages:</span>
              {scholarship.educationLevels.map((lvl, idx) => (
                <span key={idx} className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white text-emerald-700 border border-emerald-200">
                  {lvl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Required Documents List */}
        {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Required Documents Checklist
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scholarship.requiredDocuments.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Process */}
        {scholarship.applicationProcess && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 text-sm">Application Procedure:</h4>
            <p className="leading-relaxed">{scholarship.applicationProcess}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Apply exclusively on official government or institutional scholarship portals.</span>
          </div>

          <a
            href={scholarship.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
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
