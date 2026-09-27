import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Check,
  CheckCircle2,
  BookmarkCheck,
  Search,
  Plus,
  HelpCircle,
  AlertCircle,
  Briefcase,
  Layers,
  MapPin,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ALL_STATES_AND_UTS,
  EDUCATION_LEVELS,
  STREAMS,
  CAREER_SECTORS
} from '../constants/masterData';

// UI Primitives
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Combobox from '../components/ui/Combobox';
import CareerNodeGraph from '../components/visualizations/CareerNodeGraph';

const Onboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveLaterLoading, setSaveLaterLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Step 1: Academic Information
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || 'Undergraduate');
  const [classYear, setClassYear] = useState(user?.classYear || '');
  const [stream, setStream] = useState(user?.stream || '');
  const [boardOrUniversity, setBoardOrUniversity] = useState(user?.boardOrUniversity || '');
  const [percentageOrCgpa, setPercentageOrCgpa] = useState(user?.percentageOrCgpa || '');

  // Step 1: Score Type helper (CGPA vs Percentage)
  const initialScoreType = useMemo(() => {
    const val = (user?.percentageOrCgpa || '').toLowerCase();
    if (val.includes('cgpa') || (parseFloat(val) > 0 && parseFloat(val) <= 10)) {
      return 'cgpa';
    }
    return 'percentage';
  }, [user]);

  const [scoreType, setScoreType] = useState(initialScoreType);
  const [rawScore, setRawScore] = useState(() => {
    const val = user?.percentageOrCgpa || '';
    return val.replace(/[^0-9.]/g, '');
  });

  // Step 2: Location & Preferences
  const [state, setState] = useState(user?.state || '');
  const [preferredStudyLocation, setPreferredStudyLocation] = useState(user?.preferredStudyLocation || '');
  const [interests, setInterests] = useState(user?.interests || []);
  const [interestSearch, setInterestSearch] = useState('');

  // Step 3: Career Interests & Skills
  const [careerInterests, setCareerInterests] = useState(user?.careerInterests || []);
  const [skills, setSkills] = useState(user?.skills || []);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Synchronize score to percentageOrCgpa formatted string
  const handleScoreChange = (type, val) => {
    setScoreType(type);
    setRawScore(val);
    if (!val) {
      setPercentageOrCgpa('');
      return;
    }
    const cleanNum = val.trim();
    if (type === 'cgpa') {
      setPercentageOrCgpa(`${cleanNum} CGPA`);
    } else {
      setPercentageOrCgpa(`${cleanNum}%`);
    }
  };

  // Structured Year Options
  const yearOptions = useMemo(() => {
    const base = [
      '1st Year / Fresher',
      '2nd Year / Sophomore',
      '3rd Year / Pre-Final Year',
      '4th Year / Final Year',
      'Class 10 (Secondary)',
      'Class 11 / 1st Year Inter',
      'Class 12 / 2nd Year Inter',
      'Postgraduate 1st Year',
      'Postgraduate Final Year',
      'Recent Graduate / Alumnus'
    ];
    // If user's existing classYear isn't in base list, include it
    if (classYear && !base.includes(classYear)) {
      return [classYear, ...base];
    }
    return base;
  }, [classYear]);

  // Suggestions for Stream / Specialization based on Education Level
  const streamSuggestions = useMemo(() => {
    if (educationLevel.includes('Engineering')) {
      return [
        'Computer Science & Engineering (CSE)',
        'Artificial Intelligence & Machine Learning',
        'Data Science & Engineering',
        'Electronics & Communication (ECE)',
        'Mechanical Engineering',
        'Information Technology (IT)',
        'Civil Engineering',
        'Electrical & Electronics (EEE)',
        'Biotechnology & Bioinformatics'
      ];
    }
    if (educationLevel.includes('Intermediate') || educationLevel.includes('11th')) {
      return [
        'Science (MPC - Math, Physics, Chemistry)',
        'Science (BiPC - Biology, Physics, Chemistry)',
        'Commerce (MEC - Math, Economics, Commerce)',
        'Commerce (CEC - Civics, Economics, Commerce)',
        'Arts / Humanities',
        'Vocational Stream'
      ];
    }
    if (educationLevel.includes('Undergraduate')) {
      return [
        'B.Sc Computer Science',
        'B.Com Finance & Accounting',
        'BBA Business Administration',
        'BCA Computer Applications',
        'B.Sc Mathematics & Statistics',
        'B.A English / Media Studies',
        'B.Sc Physics / Chemistry',
        'B.Sc Biotechnology'
      ];
    }
    if (educationLevel.includes('Diploma')) {
      return [
        'Diploma in Computer Engineering',
        'Diploma in Mechanical Engineering',
        'Diploma in Electrical & Electronics',
        'Diploma in Civil Engineering',
        'Diploma in Electronics & Communication'
      ];
    }
    if (educationLevel.includes('Postgraduate')) {
      return [
        'M.Tech Computer Science',
        'MBA Finance & Analytics',
        'MBA Marketing & Strategy',
        'M.Sc Data Science',
        'MCA Computer Applications',
        'M.Tech VLSI & Embedded Systems'
      ];
    }
    return STREAMS;
  }, [educationLevel]);

  // University / Board Suggestions
  const boardSuggestions = [
    'CBSE (Central Board of Secondary Education)',
    'ICSE / ISC Board',
    'State Board of Intermediate Education',
    'JNTU (Jawaharlal Nehru Technological University)',
    'Anna University',
    'Delhi University (DU)',
    'Mumbai University (MU)',
    'Visvesvaraya Technological University (VTU)',
    'IIT (Indian Institute of Technology)',
    'NIT (National Institute of Technology)',
    'Savitribai Phule Pune University',
    'Osmania University',
    'Calicut University / Kerala University'
  ];

  // Master Lists for Steps 2 and 3
  const careerOptionsList = [
    'Engineering',
    'Medicine & Healthcare',
    'Computer Science',
    'Artificial Intelligence',
    'Government Jobs',
    'Defence & Armed Forces',
    'Law & Judiciary',
    'Management & Strategy',
    'Finance & Banking',
    'Design & UI/UX',
    'Agriculture & Agritech',
    'Teaching & Education',
    'Scientific Research',
    'Entrepreneurship & Startups',
    'Skilled Trades & Aviation'
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
    'Financial Markets & Banking',
    'Data Science & Analytics',
    'Cybersecurity & Ethical Hacking',
    'Game Development',
    'Public Policy & Social Impact'
  ];

  const skillOptionsList = [
    'Problem Solving',
    'Mathematics & Statistics',
    'Python Coding',
    'Web Development',
    'Logical Reasoning',
    'English Communication',
    'AutoCAD & 3D Modeling',
    'Electrical Circuitry',
    'Data Analysis & SQL',
    'Public Speaking & Leadership',
    'Machine Learning',
    'Financial Modeling'
  ];

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCustomSkillInput('');
    }
  };

  // Validation per step
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!educationLevel) {
        newErrors.educationLevel = 'Please select your current education level';
      }
      if (!classYear) {
        newErrors.classYear = 'Please choose your current class or year of study';
      }
      if (rawScore) {
        const num = parseFloat(rawScore);
        if (scoreType === 'cgpa' && (isNaN(num) || num < 0 || num > 10)) {
          newErrors.rawScore = 'CGPA score must be between 0.0 and 10.0';
        } else if (scoreType === 'percentage' && (isNaN(num) || num < 0 || num > 100)) {
          newErrors.rawScore = 'Percentage must be between 0% and 100%';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save & Continue Later
  const handleSaveAndContinueLater = async () => {
    setSaveLaterLoading(true);
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
        skills,
        onboardingCompleted: false
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save draft onboarding:', err);
      // Still allow navigation to dashboard if user requested later
      navigate('/dashboard');
    } finally {
      setSaveLaterLoading(false);
    }
  };

  // Final Submission
  const handleFinish = async () => {
    if (!validateStep(3)) return;

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
        skills,
        onboardingCompleted: true
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update onboarding profile:', err);
      alert('Failed to save profile. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered interests in Step 2
  const filteredInterests = generalInterestsList.filter((item) =>
    item.toLowerCase().includes(interestSearch.toLowerCase())
  );

  // Profile setup percentage
  const profileCompletionPercentage = useMemo(() => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  }, [step]);

  // Current step metadata
  const stepLabels = [
    { num: '01', title: 'Academic', desc: 'Education & Baseline' },
    { num: '02', title: 'Interests', desc: 'Location & Passions' },
    { num: '03', title: 'Career Goals', desc: 'Industries & Skills' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0b0a] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Card with Desktop Two-Column Layout */}
        <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl shadow-black/60 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

            {/* ============================================================== */}
            {/* LEFT COLUMN: Visual Identity & Live Career Node Visualization */}
            {/* ============================================================== */}
            <div className="lg:col-span-5 bg-stone-950/70 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col justify-between relative overflow-hidden">
              <CareerNodeGraph
                step={step}
                data={{
                  educationLevel,
                  classYear,
                  stream,
                  percentageOrCgpa,
                  state,
                  interests,
                  careerInterests
                }}
              />
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: Modern Form Steps */}
            {/* ============================================================== */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-stone-900/90">
              <div>
                {/* Top Step Progress Bar */}
                <div className="mb-8">
                  {/* Step Header Tabs */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      {stepLabels.map((s, idx) => {
                        const stepNum = idx + 1;
                        const isCurrent = step === stepNum;
                        const isPast = step > stepNum;

                        return (
                          <button
                            key={s.num}
                            type="button"
                            onClick={() => isPast && setStep(stepNum)}
                            disabled={!isPast}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg ${
                              isCurrent
                                ? 'bg-amber-500/15 text-amber-300'
                                : isPast
                                  ? 'text-stone-300 hover:bg-stone-800 cursor-pointer'
                                  : 'text-stone-500 cursor-default'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-3xs font-black shrink-0 ${
                                isCurrent
                                  ? 'bg-amber-500 text-stone-950'
                                  : isPast
                                    ? 'bg-emerald-500 text-stone-950'
                                    : 'bg-stone-800 text-stone-500'
                              }`}
                            >
                              {isPast ? <Check className="w-3 h-3" /> : s.num}
                            </span>
                            <span className="hidden sm:inline">{s.title}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Profile Setup Completion Pill */}
                    <div className="inline-flex items-center gap-1.5 bg-stone-800 text-stone-300 px-3 py-1 rounded-full text-2xs font-extrabold shrink-0 border border-stone-700">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Profile setup {profileCompletionPercentage}% complete</span>
                    </div>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500 ease-out"
                      style={{ width: `${profileCompletionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* ========================================================== */}
                {/* STEP 1: Academic Background */}
                {/* ========================================================== */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        Let's build your path.
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                        Tell us about your current education so we can personalize the opportunities, exams, and career paths you see.
                      </p>
                    </div>

                    <div className="space-y-4.5">
                      {/* Education Level */}
                      <div>
                        <Label required htmlFor="education-level-select">
                          Current Education Level
                        </Label>
                        <select
                          id="education-level-select"
                          value={educationLevel}
                          onChange={(e) => {
                            setEducationLevel(e.target.value);
                            if (errors.educationLevel) {
                              setErrors((prev) => ({ ...prev, educationLevel: null }));
                            }
                          }}
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-stone-900 font-medium text-stone-100 transition-all outline-none cursor-pointer ${
                            errors.educationLevel
                              ? 'border-rose-500/80 bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-stone-800 hover:border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15'
                          }`}
                        >
                          <option value="Class 10">Class 10 (Secondary School)</option>
                          <option value="Intermediate / 11th–12th">Intermediate / 11th–12th (Junior College / High School)</option>
                          <option value="Diploma / Polytechnic">Diploma / Polytechnic (3 Years Technical)</option>
                          <option value="ITI">ITI / Vocational Trades</option>
                          <option value="Undergraduate">Undergraduate / Degree (B.Sc, B.Com, BA, BCA, BBA)</option>
                          <option value="Engineering">Engineering (B.Tech / B.E)</option>
                          <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, MBA, MCA)</option>
                        </select>
                        <p className="mt-1 text-2xs text-stone-500">
                          Used to show opportunities relevant to your current education.
                        </p>
                        {errors.educationLevel && (
                          <p className="mt-1 text-xs font-semibold text-rose-400">
                            {errors.educationLevel}
                          </p>
                        )}
                      </div>

                      {/* Class / Year of Study & Academic Score (Two Columns) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Class / Year of Study */}
                        <div>
                          <Label required htmlFor="class-year-select">
                            Class / Year of Study
                          </Label>
                          <select
                            id="class-year-select"
                            value={classYear}
                            onChange={(e) => {
                              setClassYear(e.target.value);
                              if (errors.classYear) {
                                setErrors((prev) => ({ ...prev, classYear: null }));
                              }
                            }}
                            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-stone-900 font-medium text-stone-100 transition-all outline-none cursor-pointer ${
                              errors.classYear
                                ? 'border-rose-500/80 bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : 'border-stone-800 hover:border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15'
                            }`}
                          >
                            <option value="">Select your study year</option>
                            {yearOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-2xs text-stone-500">
                            Helps identify immediate application eligibility windows.
                          </p>
                          {errors.classYear && (
                            <p className="mt-1 text-xs font-semibold text-rose-400">
                              {errors.classYear}
                            </p>
                          )}
                        </div>

                        {/* Academic Score with Percentage / CGPA Toggle */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <Label optional htmlFor="academic-score-input" className="mb-0">
                              Academic Score
                            </Label>
                            {/* Toggle Selector */}
                            <div className="inline-flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700">
                              <button
                                type="button"
                                onClick={() => handleScoreChange('percentage', rawScore)}
                                className={`px-2 py-0.5 rounded-md text-3xs font-bold transition-all ${
                                  scoreType === 'percentage'
                                    ? 'bg-amber-500 text-stone-950 shadow-2xs font-black'
                                    : 'text-stone-400 hover:text-stone-200'
                                }`}
                              >
                                % (0–100)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleScoreChange('cgpa', rawScore)}
                                className={`px-2 py-0.5 rounded-md text-3xs font-bold transition-all ${
                                  scoreType === 'cgpa'
                                    ? 'bg-amber-500 text-stone-950 shadow-2xs font-black'
                                    : 'text-stone-400 hover:text-stone-200'
                                }`}
                              >
                                CGPA (10.0)
                              </button>
                            </div>
                          </div>

                          <Input
                            id="academic-score-input"
                            type="text"
                            placeholder={scoreType === 'cgpa' ? 'e.g. 8.8' : 'e.g. 85'}
                            value={rawScore}
                            onChange={(e) => {
                              handleScoreChange(scoreType, e.target.value);
                              if (errors.rawScore) {
                                setErrors((prev) => ({ ...prev, rawScore: null }));
                              }
                            }}
                            error={errors.rawScore}
                            helperText="Ensures eligibility matching for merit scholarships."
                            success={Boolean(rawScore && !errors.rawScore)}
                          />
                        </div>
                      </div>

                      {/* Stream / Major Specialization */}
                      <div>
                        <Label optional>
                          Stream / Major Specialization
                        </Label>
                        <Combobox
                          options={streamSuggestions}
                          value={stream}
                          onChange={(val) => setStream(val)}
                          placeholder="Search or type e.g. Computer Science, MPC, Finance..."
                          helperText="Matches domain-specific internships, hackathons, and certifications."
                          success={Boolean(stream)}
                        />
                      </div>

                      {/* Board or University */}
                      <div>
                        <Label optional>
                          Board or University
                        </Label>
                        <Combobox
                          options={boardSuggestions}
                          value={boardOrUniversity}
                          onChange={(val) => setBoardOrUniversity(val)}
                          placeholder="Search or type e.g. CBSE, JNTU, Mumbai University..."
                          helperText="Personalizes state-specific quotas and institutional opportunities."
                          success={Boolean(boardOrUniversity)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================== */}
                {/* STEP 2: Location & Interests */}
                {/* ========================================================== */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        Define your horizons.
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                        Tell us where you are based and what topics spark your curiosity to unlock targeted scholarships and programs.
                      </p>
                    </div>

                    <div className="space-y-4.5">
                      {/* State / UT & Preferred Study Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label optional>Home State / UT</Label>
                          <Combobox
                            options={ALL_STATES_AND_UTS}
                            value={state}
                            onChange={(val) => setState(val)}
                            placeholder="Select your State / UT"
                            helperText="Unlocks regional scholarships and state domicile reservations."
                            icon={MapPin}
                            success={Boolean(state)}
                          />
                        </div>

                        <div>
                          <Label optional>Preferred Study Location</Label>
                          <Combobox
                            options={[
                              'Pan India',
                              'Bengaluru',
                              'Hyderabad',
                              'Delhi NCR',
                              'Mumbai / Pune',
                              'Chennai',
                              'Kolkata',
                              'Remote / Online'
                            ]}
                            value={preferredStudyLocation}
                            onChange={(val) => setPreferredStudyLocation(val)}
                            placeholder="e.g. Bengaluru, Hyderabad, Pan India..."
                            helperText="Filters local tech hubs, colleges, and internship opportunities."
                            success={Boolean(preferredStudyLocation)}
                          />
                        </div>
                      </div>

                      {/* Topics of Interest */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label optional className="mb-0">
                            Curiosity Topics & Passions ({interests.length} selected)
                          </Label>
                          {interests.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setInterests([])}
                              className="text-3xs font-bold text-stone-400 hover:text-rose-400 transition-colors"
                            >
                              Clear all
                            </button>
                          )}
                        </div>

                        {/* Search Filter for Interests */}
                        <div className="relative mb-3">
                          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="text"
                            value={interestSearch}
                            onChange={(e) => setInterestSearch(e.target.value)}
                            placeholder="Filter topics (e.g. AI, Space, Law, Startups...)"
                            className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-stone-800 bg-stone-950/60 focus:bg-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 text-stone-100 placeholder:text-stone-500 outline-none transition-all"
                          />
                        </div>

                        {/* Interest Pills Grid */}
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                          {filteredInterests.map((interest) => {
                            const isSelected = interests.includes(interest);
                            return (
                              <button
                                type="button"
                                key={interest}
                                onClick={() => toggleItem(interests, setInterests, interest)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-xs scale-[1.02]'
                                    : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800 hover:border-stone-600 hover:text-white'
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                                )}
                                {interest}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-2xs text-stone-500">
                          We curate recommended roadmaps, articles, and workshops based on selected topics.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================== */}
                {/* STEP 3: Career Goals & Skills */}
                {/* ========================================================== */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        Shape your future.
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                        Select your target industry domains and top strengths to calibrate your custom recommendation feed.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Target Career Sectors */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label optional className="mb-0">
                            Target Career Sectors ({careerInterests.length} selected)
                          </Label>
                          <span className="text-2xs font-bold text-purple-300 bg-purple-950/40 border border-purple-800/50 px-2 py-0.5 rounded-md">
                            Industry Vectoring
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-1">
                          {careerOptionsList.map((career) => {
                            const isSelected = careerInterests.includes(career);
                            return (
                              <button
                                type="button"
                                key={career}
                                onClick={() => toggleItem(careerInterests, setCareerInterests, career)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs scale-[1.02]'
                                    : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800 hover:border-stone-600 hover:text-white'
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                                )}
                                {career}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skills & Strengths */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label optional className="mb-0">
                            Existing or Developing Skills ({skills.length} added)
                          </Label>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 mb-2.5">
                          {skillOptionsList.map((skill) => {
                            const isSelected = skills.includes(skill);
                            return (
                              <button
                                type="button"
                                key={skill}
                                onClick={() => toggleItem(skills, setSkills, skill)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-xs scale-[1.02]'
                                    : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800 hover:border-stone-600 hover:text-white'
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                                )}
                                {skill}
                              </button>
                            );
                          })}
                        </div>

                        {/* Add custom skill input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomSkill();
                              }
                            }}
                            placeholder="Add custom skill (e.g. React, C++, UI Design, Public Speaking)"
                            className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-stone-800 bg-stone-950/60 focus:bg-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 text-stone-100 placeholder:text-stone-500 outline-none transition-all"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={handleAddCustomSkill}
                            disabled={!customSkillInput.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================== */}
              {/* Bottom Actions & Navigation Bar */}
              {/* ========================================================== */}
              <div className="pt-6 mt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Back button or Save for later */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handlePrevStep}
                      icon={ArrowLeft}
                    >
                      Back
                    </Button>
                  ) : (
                    <button
                      type="button"
                      disabled={saveLaterLoading}
                      onClick={handleSaveAndContinueLater}
                      className="text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors py-2 px-1 disabled:opacity-50 cursor-pointer"
                    >
                      {saveLaterLoading ? 'Saving draft...' : 'Save & continue later'}
                    </button>
                  )}

                  {step > 1 && (
                    <button
                      type="button"
                      disabled={saveLaterLoading}
                      onClick={handleSaveAndContinueLater}
                      className="text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors py-2 px-1 disabled:opacity-50 cursor-pointer"
                    >
                      {saveLaterLoading ? 'Saving...' : 'Save & continue later'}
                    </button>
                  )}
                </div>

                {/* Main Forward CTA */}
                <div className="w-full sm:w-auto flex justify-end">
                  {step === 1 && (
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={handleNextStep}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Continue to Interests →
                    </Button>
                  )}

                  {step === 2 && (
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={handleNextStep}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Continue to Career Goals →
                    </Button>
                  )}

                  {step === 3 && (
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black shadow-lg shadow-amber-500/25"
                      disabled={saving}
                      loading={saving}
                      onClick={handleFinish}
                      icon={Sparkles}
                      iconPosition="right"
                    >
                      Create My Path ✨
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
