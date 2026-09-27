import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="w-9 h-9 rounded-xl text-xs font-bold text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span key="dots-start" className="px-1 text-stone-600 font-bold text-xs select-none">
            •••
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      const isActive = i === currentPage;
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            isActive
              ? 'bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/20 scale-105'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="dots-end" className="px-1 text-stone-600 font-bold text-xs select-none">
            •••
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="w-9 h-9 rounded-xl text-xs font-bold text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-stone-800 bg-stone-900/90 text-stone-400 hover:bg-stone-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-2xl border border-stone-800 shadow-2xs">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-stone-800 bg-stone-900/90 text-stone-400 hover:bg-stone-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
