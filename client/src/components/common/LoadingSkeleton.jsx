import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
          <div className="h-6 w-28 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-3"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-3.5 w-full bg-slate-200 rounded"></div>
          <div className="h-3.5 w-5/6 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
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
