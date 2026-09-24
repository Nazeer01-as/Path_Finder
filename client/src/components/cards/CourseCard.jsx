import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Clock, GraduationCap, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const CourseCard = ({ course }) => {
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();
  const bookmarked = isBookmarked(course._id);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark courses');
      return;
    }
    if (bookmarked) {
      await removeBookmark(course._id);
    } else {
      await addBookmark('course', course._id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-6 flex flex-col justify-between relative">
      <div>
        {course.matchReason && (
          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">{course.matchReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="primary">{course.category}</Badge>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </span>
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Course'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          <Link to={`/courses/${course._id}`}>{course.name}</Link>
        </h3>

        <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100 text-xs text-slate-700">
          <span className="font-semibold text-slate-900">Eligibility: </span>
          <span className="line-clamp-2">{course.eligibility}</span>
        </div>

        {course.skills && course.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Skills Learned:</p>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-700 font-medium"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 4 && (
                <span className="px-1.5 py-0.5 text-xs text-slate-400">
                  +{course.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/courses/${course._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-200"
        >
          <GraduationCap className="w-4 h-4" />
          Course Details & Careers
        </Link>
        {course.entranceExams && course.entranceExams.length > 0 && (
          <span className="text-xs font-medium text-slate-500">
            Via: {course.entranceExams[0]}
          </span>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
