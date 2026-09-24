import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const DeadlineBadge = ({ deadline, showIcon = true }) => {
  if (!deadline) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
        {showIcon && <Calendar className="w-3.5 h-3.5" />}
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
        {showIcon && <Clock className="w-3.5 h-3.5" />}
        Applications Closed
      </span>
    );
  }

  if (diffDays <= 7) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
        {diffDays === 0 ? 'Closes Today!' : `Closes in ${diffDays} day${diffDays === 1 ? '' : 's'}!`}
      </span>
    );
  }

  if (diffDays <= 30) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-500" />}
        Closes in {diffDays} days
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      {showIcon && <Calendar className="w-3.5 h-3.5 text-emerald-500" />}
      Upcoming ({deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
    </span>
  );
};

export default DeadlineBadge;
