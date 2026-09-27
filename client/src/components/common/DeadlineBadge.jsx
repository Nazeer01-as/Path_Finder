import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const DeadlineBadge = ({ deadline, showIcon = true, className = '' }) => {
  if (!deadline) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-800/90 text-stone-400 border border-stone-700/80 shadow-2xs ${className}`}>
        {showIcon && <Calendar className="w-3.5 h-3.5 opacity-70" />}
        Check Official Site
      </span>
    );
  }

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-stone-800 text-stone-500 border border-stone-700 shadow-2xs ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5" />}
        Applications Closed
      </span>
    );
  }

  if (diffDays <= 7) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/90 shadow-xs shadow-rose-950/20 animate-pulse ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
        {diffDays === 0 ? 'Closes Today!' : `Closes in ${diffDays} day${diffDays === 1 ? '' : 's'}!`}
      </span>
    );
  }

  if (diffDays <= 30) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/80 shadow-2xs ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
        Closes in {diffDays} days
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 shadow-2xs ${className}`}>
      {showIcon && <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
      Upcoming ({deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
    </span>
  );
};

export default DeadlineBadge;
