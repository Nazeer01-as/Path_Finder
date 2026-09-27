import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto space-y-6 relative z-10 bg-stone-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl">
        <div className="w-18 h-18 rounded-3xl bg-stone-800/80 border border-stone-700 text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-9 h-9" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-950/40 text-rose-400 border border-rose-800/60">
            Error 404
          </span>
          <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
            Pathway Not Found
          </h2>
          <p className="text-sm text-stone-400 mt-1 leading-relaxed">
            The pathway, exam, or resource you are looking for has been moved or does not exist.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
