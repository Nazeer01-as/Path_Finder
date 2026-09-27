import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Clock, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const CourseCard = ({ course }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(course._id);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark courses');
      return;
    }
    setBookmarking(true);
    try {
      if (bookmarked) {
        await removeBookmark(course._id);
      } else {
        await addBookmark('course', course._id);
      }
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="group bg-stone-900/80 rounded-2xl border border-stone-800 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden text-stone-200">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {course.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{course.matchReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="amber" dot>{course.category}</Badge>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-300 bg-stone-800/90 border border-stone-700/80 px-2.5 py-1 rounded-full shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {course.duration}
            </span>
            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarking}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                bookmarked
                  ? 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-xs shadow-rose-950/20'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-800'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Course'}
              aria-label={bookmarked ? 'Remove Bookmark' : 'Save Course'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-rose-500 text-rose-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/courses/${course._id}`}>{course.name}</Link>
        </h3>

        <div className="bg-stone-800/70 rounded-xl p-3 mb-3.5 border border-stone-700/80 text-xs text-stone-300">
          <span className="font-bold text-white">Eligibility: </span>
          <span className="line-clamp-2 font-medium">{course.eligibility}</span>
        </div>

        {course.skills && course.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-stone-400 mb-2">Key Skills Acquired:</p>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 text-xs rounded-lg bg-stone-800 text-stone-300 font-semibold border border-stone-700/80"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 4 && (
                <span className="px-2 py-0.5 text-xs text-stone-500 font-bold">
                  +{course.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/courses/${course._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-amber-950/60 text-amber-300 hover:bg-amber-500 hover:text-stone-950 border border-amber-800/60 transition-all duration-200 group-hover:shadow-sm"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Course Details & Careers</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {course.entranceExams && course.entranceExams.length > 0 && (
          <span className="text-xs font-semibold text-stone-400 bg-stone-800/80 px-2 py-1 rounded-lg border border-stone-700">
            Via: {course.entranceExams[0]}
          </span>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
