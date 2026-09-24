import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  MapPin,
  Sparkles,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Academic Information
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || 'Intermediate / 11th–12th');
  const [classYear, setClassYear] = useState('12th Grade / 2nd Year');
  const [stream, setStream] = useState('Science (MPC / Physics, Chem, Math)');
  const [boardOrUniversity, setBoardOrUniversity] = useState('CBSE / State Board');
  const [percentageOrCgpa, setPercentageOrCgpa] = useState('');

  // Step 2: Location & Preferences
  const [state, setState] = useState('Telangana');
  const [preferredStudyLocation, setPreferredStudyLocation] = useState('Home State / Pan India');
  const [interests, setInterests] = useState([
    'Computer Science',
    'Artificial Intelligence',
    'Space Tech'
  ]);

  // Step 3: Career Interests & Skills
  const [careerInterests, setCareerInterests] = useState(['Engineering', 'Computer Science']);
  const [skills, setSkills] = useState(['Problem Solving', 'Mathematics']);

  const careerOptionsList = [
    'Engineering',
    'Medicine',
    'Computer Science',
    'Artificial Intelligence',
    'Government Jobs',
    'Defence',
    'Law',
    'Management',
    'Finance',
    'Design',
    'Agriculture',
    'Teaching',
    'Research',
    'Entrepreneurship',
    'Skilled Trades'
  ];

  const generalInterestsList = [
    'Software & Coding',
    'Robotics & AI',
    'Space & Astronomy',
    'Medical & Bio Sciences',
    'National Defence & NDA',
    'Civil Services & UPSC',
    'Corporate Law & Judiciary',
    'Business & Startups',
    'Creative UI/UX Design',
    'Automotive & Mechanical',
    'Electrical & Solar Energy',
    'Financial Markets & Banking'
  ];

  const skillOptionsList = [
    'Problem Solving',
    'Mathematics',
    'Python Coding',
    'Web Development',
    'Logical Reasoning',
    'English Communication',
    'AutoCAD & Design',
    'Electrical Wiring',
    'Data Analysis',
    'Public Speaking'
  ];

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        educationLevel,
        classYear,
        stream,
        boardOrUniversity,
        percentageOrCgpa,
        state,
        preferredStudyLocation,
        interests,
        careerInterests,
        skills
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update onboarding profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-8">
        {/* Progress Bar & Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 text-sm">PathFinder Setup</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Step {step} of 3
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Academic Background */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Academic Background
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tell us where you are currently studying so we can filter relevant entrance exams & opportunities.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
                >
                  <option value="Class 10">Class 10 (Secondary School)</option>
                  <option value="Intermediate / 11th–12th">Intermediate / 11th–12th (Junior College)</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic (3 Years)</option>
                  <option value="ITI">ITI / Vocational Trades</option>
                  <option value="Undergraduate">Undergraduate / Degree (B.Sc, B.Com, BA, BCA)</option>
                  <option value="Engineering">Engineering (B.Tech / B.E)</option>
                  <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, MBA, MCA)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Class / Year of Study
                  </label>
                  <input
                    type="text"
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    placeholder="e.g. 10th Class, 12th Grade, 2nd Year"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stream / Major Specialization
                </label>
                <input
                  type="text"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  placeholder="e.g. Science MPC, BiPC, Computer Science, Mechanical..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Board or University
                </label>
                <input
                  type="text"
                  value={boardOrUniversity}
                  onChange={(e) => setBoardOrUniversity(e.target.value)}
                  placeholder="e.g. CBSE, ICSE, State Board, JNTU..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location & Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Location & Topics of Interest
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Help us discover state-specific scholarships and courses tailored to your passions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Home State / UT
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Telangana, Andhra Pradesh, Delhi..."
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
                    placeholder="e.g. Bengaluru, Hyderabad, Pan India..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What topics excite you? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {generalInterestsList.map((interest) => {
                    const isSelected = interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleItem(interests, setInterests, interest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Career Goals & Skills */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Career Goals & Skills
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your targeted career sectors so our recommendation engine can map the right educational pathway for you.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Career Sectors:
                </label>
                <div className="flex flex-wrap gap-2">
                  {careerOptionsList.map((career) => {
                    const isSelected = careerInterests.includes(career);
                    return (
                      <button
                        type="button"
                        key={career}
                        onClick={() => toggleItem(careerInterests, setCareerInterests, career)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {career}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Existing or Developing Skills:
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptionsList.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleItem(skills, setSkills, skill)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Profile & Go to Dashboard
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
