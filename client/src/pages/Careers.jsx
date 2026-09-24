import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Compass, X, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import CareerCard from '../components/cards/CareerCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { GridSkeleton } from '../components/common/LoadingSkeleton';

const Careers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || 'All');

  const sectors = [
    'All',
    'Information Technology',
    'Government & Public Administration',
    'Healthcare & Medicine',
    'Manufacturing & Green Energy',
    'Law',
    'Finance & Commerce'
  ];

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const page = searchParams.get('page') || 1;
        const queryParams = new URLSearchParams();
        queryParams.set('page', page);
        queryParams.set('limit', 9);
        if (search) queryParams.set('search', search);
        if (sector && sector !== 'All') queryParams.set('sector', sector);

        const res = await api.get(`/careers?${queryParams.toString()}`);
        setCareers(res.data.data || []);
        if (res.data.pagination) {
          setPagination({
            page: res.data.pagination.page,
            totalPages: res.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCareers();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, sector, searchParams]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setSector('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            Interactive Roadmaps
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Career Pathways & Progression Flow
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore complete step-by-step career journeys: From Class 10 → Entrance Exams → Degrees → Skills → Internships → Dream Careers.
        </p>
      </div>

      {/* Visual Roadmap Blueprint Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <h3 className="text-lg font-bold">How PathFinder Maps Your Career:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: 'Step 1', name: 'Education', sub: 'Class 10 / 12th / ITI' },
            { step: 'Step 2', name: 'Entrance Exams', sub: 'Qualify Gateways' },
            { step: 'Step 3', name: 'Course', sub: 'B.Tech / MBBS / Degree' },
            { step: 'Step 4', name: 'In-Demand Skills', sub: 'Practical Mastery' },
            { step: 'Step 5', name: 'Internship', sub: 'Industry Exposure' },
            { step: 'Step 6', name: 'Job & Growth', sub: 'High-Impact Roles' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[10px] text-cyan-300 font-bold uppercase">{item.step}</span>
              <p className="font-bold text-sm text-white mt-0.5">{item.name}</p>
              <p className="text-[11px] text-slate-300">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by career title, sector, or role (e.g., Software Engineer, IAS Officer, Doctor)..."
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
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSector(sec)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                sector === sec
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : careers.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No career pathways found"
          description="We couldn't find any career roadmaps matching your active query."
          actionText="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.map((career) => (
            <CareerCard key={career._id} career={career} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Careers;
