import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EDUCATION_LEVELS } from '../constants/masterData';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || 'Class 10');
  const [classYear, setClassYear] = useState(user?.classYear || '');
  const [stream, setStream] = useState(user?.stream || '');
  const [boardOrUniversity, setBoardOrUniversity] = useState(user?.boardOrUniversity || '');
  const [percentageOrCgpa, setPercentageOrCgpa] = useState(user?.percentageOrCgpa || '');
  const [state, setState] = useState(user?.state || '');
  const [preferredStudyLocation, setPreferredStudyLocation] = useState(user?.preferredStudyLocation || '');

  const [interestsText, setInterestsText] = useState((user?.interests || []).join(', '));
  const [skillsText, setSkillsText] = useState((user?.skills || []).join(', '));
  const [careerInterestsText, setCareerInterestsText] = useState((user?.careerInterests || []).join(', '));

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const educationOptions = EDUCATION_LEVELS;

  const calculateProfileScore = () => {
    let score = 30;
    if (educationLevel) score += 20;
    if (stream) score += 15;
    if (skillsText.trim().length > 0) score += 20;
    if (careerInterestsText.trim().length > 0) score += 15;
    return Math.min(score, 100);
  };

  const profileScore = calculateProfileScore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const interests = interestsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const skills = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const careerInterests = careerInterestsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        name,
        educationLevel,
        classYear,
        stream,
        boardOrUniversity,
        percentageOrCgpa,
        state,
        preferredStudyLocation,
        interests,
        skills,
        careerInterests
      });

      setMessage('Your profile and preferences have been updated successfully! Your dashboard recommendations will reflect these changes.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/50">
            Profile Settings
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Student Profile & Career Preferences
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Keep your academic details and career interests up to date to receive highly tailored opportunity alerts.
        </p>
      </div>

      {/* Profile Readiness Meter Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Career Profile Readiness
            </span>
            <h3 className="text-xl font-black text-white">
              Profile Completeness: {profileScore}%
            </h3>
            <p className="text-xs text-stone-400">
              {profileScore >= 90
                ? 'Your profile is fully optimized for intelligent opportunity matching!'
                : 'Complete your streams, skills, and target career interests to maximize match quality.'}
            </p>
          </div>
          <div className="w-full sm:w-48 shrink-0">
            <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${profileScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-emerald-300 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-rose-300 bg-rose-950/30 border border-rose-800/50 rounded-2xl animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-10 shadow-xl space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950 text-stone-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-4 pt-4 border-t border-stone-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            Academic Level & Background
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Current Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100"
              >
                {educationOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-stone-900 text-stone-100">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Class / Year
              </label>
              <input
                type="text"
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
                placeholder="e.g. 10th Standard, 12th Grade, 2nd Year"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Stream / Major
              </label>
              <input
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g. Science MPC, BiPC, Computer Science..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Percentage / CGPA
              </label>
              <input
                type="text"
                value={percentageOrCgpa}
                onChange={(e) => setPercentageOrCgpa(e.target.value)}
                placeholder="e.g. 85% or 8.8 CGPA"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Location & Preferences */}
        <div className="space-y-4 pt-4 border-t border-stone-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            Location & Geographic Scope
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Home State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Telangana, Maharashtra, Karnataka..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Preferred Study Location
              </label>
              <input
                type="text"
                value={preferredStudyLocation}
                onChange={(e) => setPreferredStudyLocation(e.target.value)}
                placeholder="e.g. Hyderabad, Bengaluru, Pan India..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Skills & Career Goals */}
        <div className="space-y-4 pt-4 border-t border-stone-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Interests, Skills & Career Sectors (Comma Separated)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Target Career Sectors
              </label>
              <input
                type="text"
                value={careerInterestsText}
                onChange={(e) => setCareerInterestsText(e.target.value)}
                placeholder="Engineering, Computer Science, Artificial Intelligence, Government Jobs..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                General Academic & Technology Interests
              </label>
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="Software, Robotics, Space Tech, Healthcare, Design..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Current Skills & Strengths
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Python, Problem Solving, Mathematics, Electrical, Writing..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-800 bg-stone-950/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden font-medium text-stone-100 placeholder:text-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer active:scale-98"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
