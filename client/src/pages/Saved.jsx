import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

const Saved = () => {
  const { bookmarks, removeBookmark, fetchBookmarks } = useAuth();
  const [filterType, setFilterType] = useState('all');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-md">
            Personal Portfolio
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Saved Opportunities & Roadmaps
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Keep track of important deadlines, examinations, and career blueprints you have saved.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'opportunity', label: 'Opportunities' },
          { id: 'exam', label: 'Examinations' },
          { id: 'scholarship', label: 'Scholarships' },
          { id: 'course', label: 'Courses' },
          { id: 'career', label: 'Career Paths' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
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
          onAction={() => (window.location.href = '/opportunities')}
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
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="rose" size="xs">
                      {b.itemType.toUpperCase()}
                    </Badge>
                    <button
                      onClick={() => removeBookmark(b._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                    <Link to={detailUrl}>{title}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {item.description || item.eligibility || 'Saved bookmark item.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <Link
                    to={detailUrl}
                    className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {item.officialWebsite && (
                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
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
