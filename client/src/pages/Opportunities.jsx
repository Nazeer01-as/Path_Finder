import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import OpportunityCard from '../components/cards/OpportunityCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { GridSkeleton } from '../components/common/LoadingSkeleton';

const Opportunities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [educationLevel, setEducationLevel] = useState(searchParams.get('educationLevel') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Education',
    'Entrance Exams',
    'Competitive Exams',
    'Scholarships',
    'Internships',
    'Jobs',
    'Skill Development',
    'Certifications',
    'Fellowships',
    'Government Programs',
    'Private Opportunities',
    'Career Programs'
  ];

  const educationLevels = [
    'All Levels',
    'Class 10',
    'Intermediate / 11th–12th',
    'Diploma / Polytechnic',
    'ITI',
    'Undergraduate',
    'Engineering',
    'Postgraduate'
  ];

  useEffect(() => {
    // Sync URL param if changed externally
    const urlEdu = searchParams.get('educationLevel');
    if (urlEdu) setEducationLevel(urlEdu);
  }, [searchParams]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const page = searchParams.get('page') || 1;
        const queryParams = new URLSearchParams();
        queryParams.set('page', page);
        queryParams.set('limit', 9);
        if (search) queryParams.set('search', search);
        if (category && category !== 'All') queryParams.set('category', category);
        if (educationLevel && educationLevel !== 'All Levels') queryParams.set('educationLevel', educationLevel);
        if (sortBy) queryParams.set('sortBy', sortBy);

        const res = await api.get(`/opportunities?${queryParams.toString()}`);
        setOpportunities(res.data.data || []);
        if (res.data.pagination) {
          setPagination({
            page: res.data.pagination.page,
            totalPages: res.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category, educationLevel, sortBy, searchParams]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setEducationLevel('All Levels');
    setSortBy('createdAt');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            Centralized Opportunity Hub
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Opportunity Explorer
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore internships, government programs, certifications, and fellowships across India.
        </p>
      </div>

      {/* Search & Top Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, organization, skill, or keywords (e.g., ISRO, coding, fellowship)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Education Level Quick Filter */}
          <div className="w-full md:w-56">
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden bg-white text-slate-700 font-medium"
            >
              {educationLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden bg-white text-slate-700 font-medium"
            >
              <option value="createdAt">Latest Added</option>
              <option value="deadline">Closing Soonest</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                (category === cat || (!category && cat === 'All'))
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Loading or Empty State */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description="We couldn't find any opportunities matching your active filters. Try resetting filters or searching for something else."
          actionText="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Opportunities;
