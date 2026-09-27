import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-stone-900/80 backdrop-blur-xs rounded-2xl border border-stone-800 p-6 shadow-sm flex flex-col justify-between overflow-hidden relative">
      <div className="animate-pulse space-y-4">
        {/* Badges line */}
        <div className="flex items-center justify-between gap-3">
          <div className="h-6 w-24 bg-stone-800 rounded-full" />
          <div className="h-6 w-28 bg-stone-800 rounded-full" />
        </div>
        {/* Title */}
        <div className="h-6 w-3/4 bg-stone-800 rounded-lg" />
        {/* Meta */}
        <div className="h-4 w-1/2 bg-stone-800/80 rounded-md" />
        {/* Pill highlight */}
        <div className="h-10 w-full bg-stone-800/50 rounded-xl" />
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-stone-800/60 rounded" />
          <div className="h-3.5 w-4/5 bg-stone-800/60 rounded" />
        </div>
      </div>
      <div className="pt-4 mt-6 border-t border-stone-800 flex items-center justify-between animate-pulse">
        <div className="h-8 w-24 bg-stone-800 rounded-xl" />
        <div className="h-8 w-8 bg-stone-800 rounded-xl" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default CardSkeleton;
