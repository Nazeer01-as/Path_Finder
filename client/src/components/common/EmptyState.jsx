import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No items found',
  description = 'Try adjusting your search criteria, removing filters, or check back later.',
  actionText,
  onAction
}) => {
  return (
    <div className="bg-stone-900/80 backdrop-blur-md rounded-3xl border border-stone-800 p-10 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-sm relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-18 h-18 bg-stone-800/80 border border-stone-700 rounded-3xl flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-sm relative z-10">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
      <p className="text-sm text-stone-400 mb-6 leading-relaxed relative z-10">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 rounded-xl transition-all shadow-2xs hover:shadow-sm cursor-pointer relative z-10"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
