import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  Sparkles,
  BookOpen,
  Briefcase,
  Award,
  CheckCircle2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import api from '../api/axios';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isBookmarked, addBookmark, removeBookmark } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.data);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-400 text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-100 mb-2">Course Not Found</h2>
        <Link to="/courses" className="text-amber-400 hover:text-amber-300 font-bold text-sm">
          ← Return to Courses
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(course._id);

  const handleBookmarkToggle = async () => {
    if (!user) {
      alert('Please log in to save courses');
      return;
    }
    if (bookmarked) {
      await removeBookmark(course._id);
    } else {
      await addBookmark('course', course._id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses Explorer
      </Link>

      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-10 shadow-xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="primary" size="md">
            {course.category}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700/60">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Duration: {course.duration}
            </span>
            <button
              onClick={handleBookmarkToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                bookmarked
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                  : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-800/60'
              }`}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-rose-400" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save Course
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            {course.name}
          </h1>
        </div>

        {/* Eligibility Details Box */}
        <div className="bg-amber-950/20 rounded-2xl p-5 border border-amber-800/40 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Eligibility & Minimum Requirements
          </h3>
          <p className="text-sm text-stone-200 font-medium leading-relaxed">
            {course.eligibility}
          </p>
        </div>

        {/* Skills Learned */}
        {course.skills && course.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Core Competencies & Skills Gained
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-stone-800 text-amber-300 border border-stone-700/60 text-xs font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career Opportunities & Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.careerOptions && course.careerOptions.length > 0 && (
            <div className="p-5 bg-stone-800/40 rounded-2xl border border-stone-700/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Career Opportunities
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {course.careerOptions.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.higherEducationOptions && course.higherEducationOptions.length > 0 && (
            <div className="p-5 bg-stone-800/40 rounded-2xl border border-stone-700/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Higher Education Pathways
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {course.higherEducationOptions.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Entrance Exams Associated */}
        {course.entranceExams && course.entranceExams.length > 0 && (
          <div className="p-5 bg-stone-800/40 rounded-2xl border border-stone-700/60 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              Primary Entrance Exams for Admission
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {course.entranceExams.map((examName, idx) => (
                <Link
                  key={idx}
                  to={`/exams?search=${encodeURIComponent(examName)}`}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 border border-purple-800/60 text-purple-300 text-xs font-bold hover:bg-stone-700 transition-colors shadow-2xs"
                >
                  {examName} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-stone-800 flex items-center justify-between">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            Explore related career roadmaps →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
