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
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Course Not Found</h2>
        <Link to="/courses" className="text-indigo-600 font-bold text-sm">
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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses Explorer
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="primary" size="md">
            {course.category}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Duration: {course.duration}
            </span>
            <button
              onClick={handleBookmarkToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                bookmarked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-rose-600" />
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {course.name}
          </h1>
        </div>

        {/* Eligibility Details Box */}
        <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            Eligibility & Minimum Requirements
          </h3>
          <p className="text-sm text-indigo-950 font-medium leading-relaxed">
            {course.eligibility}
          </p>
        </div>

        {/* Skills Learned */}
        {course.skills && course.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Core Competencies & Skills Gained
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career Opportunities & Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.careerOptions && course.careerOptions.length > 0 && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Career Opportunities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {course.careerOptions.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.higherEducationOptions && course.higherEducationOptions.length > 0 && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Higher Education Pathways
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {course.higherEducationOptions.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Entrance Exams Associated */}
        {course.entranceExams && course.entranceExams.length > 0 && (
          <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              Primary Entrance Exams for Admission
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {course.entranceExams.map((examName, idx) => (
                <Link
                  key={idx}
                  to={`/exams?search=${encodeURIComponent(examName)}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors shadow-2xs"
                >
                  {examName} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Explore related career roadmaps →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
