import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, X, IndianRupee } from 'lucide-react';
import api from '../api/axios';
import ScholarshipCard from '../components/cards/ScholarshipCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { GridSkeleton } from '../components/common/LoadingSkeleton';
import { ALL_STATES_AND_UTS } from '../constants/masterData';

const Scholarships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [educationLevel, setEducationLevel] = useState(searchParams.get('educationLevel') || 'All Levels');
  const [state, setState] = useState(searchParams.get('state') || 'All India');
  const [sortBy, setSortBy] = useState('deadline');

  const educationLevels = [
    'All Levels',
    'Class 10',
    'Intermediate / 11th–12th',
    'Diploma / Polytechnic',
    'Undergraduate',
    'Engineering',
    'Postgraduate'
  ];

  const states = ALL_STATES_AND_UTS;

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const page = searchParams.get('page') || 1;
        const queryParams = new URLSearchParams();
        queryParams.set('page', page);
        queryParams.set('limit', 9);
        if (search) queryParams.set('search', search);
        if (educationLevel && educationLevel !== 'All Levels') queryParams.set('educationLevel', educationLevel);
        if (state && state !== 'All India') queryParams.set('state', state);
        if (sortBy) queryParams.set('sortBy', sortBy);

        const res = await api.get(`/scholarships?${queryParams.toString()}`);
        setScholarships(res.data.data || []);
        if (res.data.pagination) {
          setPagination({
            page: res.data.pagination.page,
            totalPages: res.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Failed to load scholarships:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchScholarships();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, educationLevel, state, sortBy, searchParams]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setEducationLevel('All Levels');
    setState('All India');
    setSortBy('deadline');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
            Financial Aid & Merit Grants
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Scholarships & Financial Support
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Discover merit-cum-means, corporate, and government scholarships to fund your education from Class 10 to post-graduation.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by scholarship name, provider (e.g., Reliance, Tata, NSP, AICTE)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden"
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

          <div className="w-full md:w-44">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden bg-white text-slate-700 font-medium"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden bg-white text-slate-700 font-medium"
            >
              <option value="deadline">Closing Soonest</option>
              <option value="createdAt">Latest Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : scholarships.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No scholarships found"
          description="We couldn't find any scholarships matching your active search and filter criteria."
          actionText="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((sch) => (
            <ScholarshipCard key={sch._id} scholarship={sch} />
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

export default Scholarships;
