import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, ArrowRight, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

const Saved = () => {
  const { bookmarks, removeBookmark, fetchBookmarks } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const filteredBookmarks = bookmarks.filter((b) => {
    if (filterType === 'all') return true;
    return b.itemType === filterType;
  });

  const getLinkForItem = (itemType, itemId) => {
    switch (itemType) {
      case 'opportunity':
        return `/opportunities/${itemId}`;
      case 'exam':
        return `/exams/${itemId}`;
      case 'scholarship':
        return `/scholarships/${itemId}`;
      case 'course':
        return `/courses/${itemId}`;
      case 'career':
        return `/careers/${itemId}`;
      default:
        return '#';
    }
  };

  const getBadgeVariant = (itemType) => {
    switch (itemType) {
      case 'opportunity':
        return 'cyan';
      case 'exam':
        return 'purple';
      case 'scholarship':
        return 'emerald';
      case 'course':
        return 'primary';
      case 'career':
        return 'purple';
      default:
        return 'rose';
    }
  };

  const filterTabs = [
    { id: 'all', label: 'All Items', count: bookmarks.length },
    { id: 'opportunity', label: 'Opportunities', count: bookmarks.filter((b) => b.itemType === 'opportunity').length },
    { id: 'exam', label: 'Examinations', count: bookmarks.filter((b) => b.itemType === 'exam').length },
    { id: 'scholarship', label: 'Scholarships', count: bookmarks.filter((b) => b.itemType === 'scholarship').length },
    { id: 'course', label: 'Courses', count: bookmarks.filter((b) => b.itemType === 'course').length },
    { id: 'career', label: 'Career Paths', count: bookmarks.filter((b) => b.itemType === 'career').length }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/50">
            Personal Portfolio
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Saved Opportunities & Roadmaps
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Keep track of important deadlines, examinations, and career blueprints you have bookmarked.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                filterType === tab.id ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookmark Items List */}
      {filteredBookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved items yet"
          description="Click the bookmark icon on any opportunity, examination, scholarship, or course to save it here for quick access."
          actionText="Explore Opportunities"
          onAction={() => navigate('/opportunities')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((b) => {
            const item = b.item || {};
            const title = item.title || item.name || 'Saved Item';
            const detailUrl = getLinkForItem(b.itemType, b.itemId);

            return (
              <div
                key={b._id}
                className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={getBadgeVariant(b.itemType)} size="xs" dot>
                      {b.itemType.toUpperCase()}
                    </Badge>
                    <button
                      onClick={() => removeBookmark(b._id)}
                      className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                      title="Remove from Saved"
                      aria-label="Remove from Saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link to={detailUrl}>{title}</Link>
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {item.description || item.eligibility || 'Saved bookmark item.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2 text-xs">
                  <Link
                    to={detailUrl}
                    className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {item.officialWebsite && (
                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-stone-200 font-semibold flex items-center gap-1 transition-colors"
                    >
                      Official Site
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Saved;
