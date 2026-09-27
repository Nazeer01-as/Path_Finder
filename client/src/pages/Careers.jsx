import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Compass, X } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-stone-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/60">
            Interactive Roadmaps
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Career Pathways & Progression Flow
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Explore complete step-by-step career journeys: From Class 10 → Entrance Exams → Degrees → Skills → Internships → Dream Careers.
        </p>
      </div>

      {/* Visual Roadmap Blueprint Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-[#181512] to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4 border border-stone-800">
        <h3 className="text-lg font-bold text-amber-300">How PathFinder Maps Your Career:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: 'Step 1', name: 'Education', sub: 'Class 10 / 12th / ITI' },
            { step: 'Step 2', name: 'Entrance Exams', sub: 'Qualify Gateways' },
            { step: 'Step 3', name: 'Course', sub: 'B.Tech / MBBS / Degree' },
            { step: 'Step 4', name: 'In-Demand Skills', sub: 'Practical Mastery' },
            { step: 'Step 5', name: 'Internship', sub: 'Industry Exposure' },
            { step: 'Step 6', name: 'Job & Growth', sub: 'High-Impact Roles' }
          ].map((item, idx) => (
            <div key={idx} className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/60 text-center">
              <span className="text-[10px] text-amber-400 font-bold uppercase">{item.step}</span>
              <p className="font-bold text-sm text-white mt-0.5">{item.name}</p>
              <p className="text-[11px] text-stone-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by career title, sector, or role (e.g., Software Engineer, IAS Officer, Doctor)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-700 bg-stone-800 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
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
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                sector === sec
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'bg-stone-800/80 text-stone-400 hover:bg-stone-700 hover:text-white border border-stone-700/60'
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
