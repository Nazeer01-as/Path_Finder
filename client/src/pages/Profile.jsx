import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

  const educationOptions = [
    'Class 10',
    'Intermediate / 11th–12th',
    'Diploma / Polytechnic',
    'ITI',
    'Undergraduate',
    'Postgraduate',
    'Engineering',
    'Degree Student'
  ];

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
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            Profile Settings
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Student Profile & Career Preferences
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Keep your academic details and career interests up to date to receive highly tailored opportunity alerts.
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Academic Level & Background
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden bg-white font-medium"
              >
                {educationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Class / Year
              </label>
              <input
                type="text"
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
                placeholder="e.g. 10th Standard, 12th Grade, 2nd Year"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stream / Major
              </label>
              <input
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g. Science MPC, BiPC, Computer Science..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Percentage / CGPA
              </label>
              <input
                type="text"
                value={percentageOrCgpa}
                onChange={(e) => setPercentageOrCgpa(e.target.value)}
                placeholder="e.g. 85% or 8.8 CGPA"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>
          </div>
        </div>

        {/* Location & Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Location & Geographic Scope
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Home State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Telangana, Maharashtra, Karnataka..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Study Location
              </label>
              <input
                type="text"
                value={preferredStudyLocation}
                onChange={(e) => setPreferredStudyLocation(e.target.value)}
                placeholder="e.g. Hyderabad, Bengaluru, Pan India..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>
          </div>
        </div>

        {/* Skills & Career Goals */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Interests, Skills & Career Sectors (Comma Separated)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Career Sectors
              </label>
              <input
                type="text"
                value={careerInterestsText}
                onChange={(e) => setCareerInterestsText(e.target.value)}
                placeholder="Engineering, Computer Science, Artificial Intelligence, Government Jobs..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                General Academic & Technology Interests
              </label>
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="Software, Robotics, Space Tech, Healthcare, Design..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Skills & Strengths
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Python, Problem Solving, Mathematics, Electrical, Writing..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
