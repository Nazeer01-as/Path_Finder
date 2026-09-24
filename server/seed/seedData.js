// Comprehensive seed data with realistic educational data
// Marked clearly with isDemo: true and official links

const opportunities = [
  {
    title: 'ISRO Young Scientist Programme (YUVIKA 2026)',
    description: 'ISRO organizes this special programme for School Children to impart basic knowledge on Space Technology, Space Science and Space Applications to younger students with a preference to rural areas.',
    category: 'Government Programs',
    organization: 'Indian Space Research Organisation (ISRO)',
    educationLevels: ['Class 10', 'Intermediate / 11th–12th'],
    eligibility: 'Students studying in Class 9/10 with high marks in basic science and mathematics.',
    stream: ['Science', 'General'],
    location: 'ISRO Centres across India',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    applicationStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    opportunityType: 'Residential Summer Program',
    officialWebsite: 'https://www.isro.gov.in',
    tags: ['Space', 'Science', 'ISRO', 'Summer School'],
    isDemo: true
  },
  {
    title: 'Google Summer of Code (GSoC) Mentorship & Fellowship',
    description: 'A global, online program focused on bringing new contributors into open source software development through 12+ week programming projects with mentorship.',
    category: 'Internships',
    organization: 'Google Open Source',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Engineering'],
    eligibility: 'Must be 18+ and enrolled in an accredited higher education institution or recent graduate.',
    stream: ['Computer Science', 'Engineering', 'Information Technology'],
    location: 'Remote / Online',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    applicationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    opportunityType: 'Stipendiary Fellowship',
    officialWebsite: 'https://summerofcode.withgoogle.com',
    tags: ['Open Source', 'Software Development', 'Google', 'Remote'],
    isDemo: true
  },
  {
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY) 4.0 - Tech & Green Skills',
    description: 'Skill certification scheme aimed at enabling Indian youth to take up industry-relevant skill training that helps them secure a better livelihood.',
    category: 'Skill Development',
    organization: 'National Skill Development Corporation (NSDC)',
    educationLevels: ['Class 10', 'Intermediate / 11th–12th', 'Diploma / Polytechnic', 'ITI'],
    eligibility: 'Indian national, age 15-45, having completed Class 10 or equivalent vocational qualification.',
    stream: ['Any', 'Vocational', 'Technical'],
    location: 'Skill India Centres Pan India',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    applicationStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    opportunityType: 'Free Government Training & Certification',
    officialWebsite: 'https://www.pmkvyofficial.org',
    tags: ['Skill India', 'Govt Scheme', 'Free Training', 'Job Assistance'],
    isDemo: true
  },
  {
    title: 'DRDO Apprenticeship Trainee Program',
    description: 'Defence Research and Development Organisation invites applications for Graduate & Technician (Diploma) Apprentice Trainees in engineering fields.',
    category: 'Internships',
    organization: 'Defence Research & Development Organisation (DRDO)',
    educationLevels: ['Diploma / Polytechnic', 'Undergraduate', 'Engineering'],
    eligibility: 'Degree / Diploma in Mechanical, Electrical, Computer Science, Electronics or Metallurgy.',
    stream: ['Engineering', 'Polytechnic'],
    location: 'Hyderabad / Bengaluru / Pune',
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    applicationStartDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    opportunityType: 'Paid Government Apprenticeship',
    officialWebsite: 'https://www.drdo.gov.in',
    tags: ['DRDO', 'Apprenticeship', 'Engineering', 'Govt'],
    isDemo: true
  },
  {
    title: 'Microsoft India Student Ambassador Program',
    description: 'Global community program designed to empower students to build real-world skills, lead tech communities, and unlock Azure cloud perks and mentorship.',
    category: 'Career Programs',
    organization: 'Microsoft Learn',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Engineering'],
    eligibility: 'Full-time actively enrolled college/university students with an interest in technology.',
    stream: ['Computer Science', 'Engineering', 'Any Degree'],
    location: 'Campus Ambassador / Virtual',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    applicationStartDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    opportunityType: 'Community Leadership & Fellowship',
    officialWebsite: 'https://mvp.microsoft.com/studentambassadors',
    tags: ['Microsoft', 'Leadership', 'Cloud', 'Campus Ambassador'],
    isDemo: true
  },
  {
    title: 'National Apprentice Promotion Scheme (NAPS) for ITI Graduates',
    description: 'Government apprenticeship scheme offering direct on-the-job training with leading automotive and manufacturing companies with 50% govt stipend sharing.',
    category: 'Jobs',
    organization: 'Ministry of Skill Development and Entrepreneurship',
    educationLevels: ['ITI', 'Diploma / Polytechnic'],
    eligibility: 'Passed NCVT/SCVT certified ITI in trades like Fitter, Electrician, Welder, Machinist.',
    stream: ['ITI', 'Technical Trades'],
    location: 'Industrial Hubs Across India',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    opportunityType: 'Industrial Apprenticeship with Placement',
    officialWebsite: 'https://www.apprenticeshipindia.gov.in',
    tags: ['ITI', 'Stipend', 'NAPS', 'Govt Job'],
    isDemo: true
  }
];

const examinations = [
  {
    name: 'JEE Main (Joint Entrance Examination)',
    conductingBody: 'National Testing Agency (NTA)',
    category: 'Engineering',
    description: 'National-level entrance exam for admission into NITs, IIITs, CFTIs and the qualifying exam for JEE Advanced for IIT admissions.',
    eligibility: 'Passed 10+2 / Intermediate or appearing with Physics, Chemistry and Mathematics.',
    ageLimit: 'No age limit for candidates writing 10+2 in current or preceding 2 years.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['MPC / PCM Science'],
    applicationStartDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Urgent closing soon
    examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    fee: '₹1000 for General Male, ₹800 for Female/Reserved',
    examPattern: 'Computer Based Test (CBT), 90 MCQs & Numerical Questions across Physics, Chem & Math.',
    syllabus: 'CBSE / State Class 11 and 12 Physics, Chemistry, and Mathematics curriculum.',
    officialWebsite: 'https://jeemain.nta.nic.in',
    importantLinks: [
      { title: 'Information Bulletin', url: 'https://jeemain.nta.nic.in' },
      { title: 'Mock Test Portal', url: 'https://nta.ac.in/quiz' }
    ],
    isDemo: true
  },
  {
    name: 'NEET UG (National Eligibility cum Entrance Test)',
    conductingBody: 'National Testing Agency (NTA)',
    category: 'Medical',
    description: 'Single national gateway examination for admission to MBBS, BDS, BAMS, BHMS and veterinary sciences in all medical institutions in India including AIIMS.',
    eligibility: 'Passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English with min 50% marks (40% reserved).',
    ageLimit: 'Minimum 17 years completed by 31st December of the admission year.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['BiPC / PCB Science'],
    applicationStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    fee: '₹1700 for General, ₹1600 EWS/OBC, ₹1000 SC/ST/PwD',
    examPattern: 'Pen and Paper (OMR), 200 Questions (Physics, Chem, Botany, Zoology) 720 Total Marks.',
    syllabus: 'Complete NCERT Class 11 & 12 Biology, Physics, and Chemistry.',
    officialWebsite: 'https://exams.nta.ac.in/NEET/',
    importantLinks: [
      { title: 'Information Bulletin', url: 'https://exams.nta.ac.in/NEET/' }
    ],
    isDemo: true
  },
  {
    name: 'POLYCET (Polytechnic Common Entrance Test)',
    conductingBody: 'State Board of Technical Education & Training',
    category: 'Engineering',
    description: 'State entrance exam for Class 10 pass students seeking admission into 3-Year Diploma courses in Engineering and Non-Engineering disciplines.',
    eligibility: 'Passed SSC / Class 10 board examination with Mathematics and Science as compulsory subjects.',
    ageLimit: 'Minimum 15 years, no upper age limit.',
    educationLevels: ['Class 10'],
    stream: ['Class 10 General'],
    applicationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    fee: '₹400 (₹250 for SC/ST)',
    examPattern: 'Offline OMR based exam: Mathematics (60 marks), Physics (30 marks), Chemistry (30 marks).',
    syllabus: 'Class 10 State Board and NCERT syllabus in Mathematics and Physical Sciences.',
    officialWebsite: 'https://sbtet.telangana.gov.in',
    importantLinks: [
      { title: 'Syllabus & Past Papers', url: 'https://sbtet.telangana.gov.in' }
    ],
    isDemo: true
  },
  {
    name: 'National Talent Search & Science Olympiad (School Level)',
    conductingBody: 'Science Olympiad Foundation (SOF) / NCERT',
    category: 'School-Level',
    description: 'Prestigious scholarship & competitive assessment examinations conducted for school students across mathematics, science, cyber and English.',
    eligibility: 'Students enrolled in Class 8, 9, or 10 in recognized schools.',
    ageLimit: 'School age according to respective standard.',
    educationLevels: ['Class 10'],
    stream: ['All School Streams'],
    applicationStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    fee: '₹150 to ₹250 per subject',
    examPattern: 'Multiple choice questions testing logical reasoning, analytical ability and conceptual science/math.',
    syllabus: 'NCERT and CBSE corresponding class syllabus with higher order thinking skills (HOTS).',
    officialWebsite: 'https://sofworld.org',
    importantLinks: [
      { title: 'Sample Papers', url: 'https://sofworld.org' }
    ],
    isDemo: true
  },
  {
    name: 'CLAT (Common Law Admission Test)',
    conductingBody: 'Consortium of National Law Universities',
    category: 'Law',
    description: 'National level entrance exam for admissions to 5-year integrated LLB (UG) and one-year LLM (PG) programs in 24 National Law Universities.',
    eligibility: 'Passed 10+2 with minimum 45% aggregate marks (40% for SC/ST).',
    ageLimit: 'No upper age limit for UG CLAT.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['Arts', 'Commerce', 'Science'],
    applicationStartDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    fee: '₹4000 (₹3500 for SC/ST)',
    examPattern: 'Offline objective test: English, Current Affairs & GK, Legal Reasoning, Logical Reasoning, Quantitative Techniques.',
    syllabus: 'Reading comprehension, current socio-legal developments, basic legal principles and quantitative aptitude.',
    officialWebsite: 'https://consortiumofnlus.ac.in',
    importantLinks: [
      { title: 'Official Portal', url: 'https://consortiumofnlus.ac.in' }
    ],
    isDemo: true
  },
  {
    name: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    conductingBody: 'Union Public Service Commission (UPSC)',
    category: 'Government / Competitive',
    description: 'India premier competitive exam for recruitment to the higher civil services of the Government of India, including IAS, IFS, and IPS.',
    eligibility: 'Graduate in any discipline from a recognized University or in final year of graduation.',
    ageLimit: '21 to 32 years (Relaxations for OBC, SC, ST as per govt norms).',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Engineering'],
    stream: ['Any Graduate'],
    applicationStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
    fee: '₹100 (Exempted for Female/SC/ST/PwBD)',
    examPattern: '3 Stages: Prelims (GS + CSAT objective), Mains (9 written subjective papers), and Personality Interview.',
    syllabus: 'Indian Polity, History, Geography, Economy, International Relations, Ethics and Chosen Optional Subject.',
    officialWebsite: 'https://upsc.gov.in',
    importantLinks: [
      { title: 'UPSC Notification', url: 'https://upsconline.nic.in' }
    ],
    isDemo: true
  },
  {
    name: 'National Defence Academy (NDA & NA) Examination',
    conductingBody: 'Union Public Service Commission (UPSC)',
    category: 'Defence',
    description: 'Entrance examination for admission into Army, Navy and Air Force wings of the NDA and for 10+2 Cadet Entry Scheme at Indian Naval Academy.',
    eligibility: '10+2 passed or appearing. For Air Force & Navy: Physics, Chemistry & Math compulsory.',
    ageLimit: 'Unmarried male/female candidates aged between 16.5 and 19.5 years.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['Science (PCM)', 'Any stream for Army Wing'],
    applicationStartDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
    fee: '₹100 (Exempted for SC/ST and female candidates)',
    examPattern: 'Written test (Math 300 marks + General Ability Test 600 marks) followed by 5-day SSB Interview.',
    syllabus: 'Algebra, Trigonometry, Calculus, English grammar & vocabulary, GK, Physics, Chemistry, Current Affairs.',
    officialWebsite: 'https://upsc.gov.in',
    importantLinks: [
      { title: 'NDA Guidelines', url: 'https://upsc.gov.in' }
    ],
    isDemo: true
  },
  {
    name: 'SSC Combined Graduate Level (SSC CGL)',
    conductingBody: 'Staff Selection Commission (SSC)',
    category: 'Government / Competitive',
    description: 'Recruitment examination to fill various Group B and Group C non-technical posts in ministries and departments of the Government of India.',
    eligibility: 'Bachelor Degree in any discipline from a recognized University.',
    ageLimit: '18 to 32 years (varies according to post).',
    educationLevels: ['Undergraduate', 'Engineering', 'Degree'],
    stream: ['Any Graduate'],
    applicationStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    applicationLastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    examDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
    fee: '₹100 (Free for Women, SC, ST, PwBD, Ex-Servicemen)',
    examPattern: 'Tier-1 CBT (Reasoning, GA, Quantitative Aptitude, English) + Tier-2 CBT.',
    syllabus: 'General Intelligence, Quantitative Reasoning, General English, General Awareness, and Computer Knowledge.',
    officialWebsite: 'https://ssc.gov.in',
    importantLinks: [
      { title: 'SSC Portal', url: 'https://ssc.gov.in' }
    ],
    isDemo: true
  }
];

const scholarships = [
  {
    name: 'Reliance Foundation Undergraduate Scholarship 2026',
    provider: 'Reliance Foundation',
    description: 'Merit-cum-means scholarship supporting exceptional undergraduate students across India pursuing any degree program.',
    eligibility: 'First-year full-time undergraduate students with minimum 60% in Class 12 and annual household income up to ₹15 Lakhs.',
    educationLevels: ['Intermediate / 11th–12th', 'Undergraduate'],
    stream: ['Any Stream', 'Engineering', 'Commerce', 'Science'],
    incomeCriteria: 'Annual family income <= ₹15,00,000 (preference to < ₹2.5 Lakhs)',
    categoryCriteria: 'All Categories',
    benefits: 'Up to ₹2,00,000 over the duration of the degree program + mentorship network.',
    applicationStartDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    requiredDocuments: [
      'Class 10 & 12 marksheets',
      'Bonafide student certificate from current college',
      'Family Income certificate issued by competent authority',
      'Aadhaar card'
    ],
    applicationProcess: 'Apply online through the Reliance Foundation application portal with aptitude assessment.',
    officialWebsite: 'https://www.scholarships.reliancefoundation.org',
    state: 'All India',
    isDemo: true
  },
  {
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    provider: 'Department of School Education & Literacy, Govt of India',
    description: 'Central government scholarship to award scholarships to meritorious students of economically weaker sections to arrest their dropout at Class 8 and encourage education through Class 12.',
    eligibility: 'Students studying in Class 9 in government / local body schools who secured at least 55% in Class 8.',
    educationLevels: ['Class 10', 'Intermediate / 11th–12th'],
    stream: ['School Education'],
    incomeCriteria: 'Annual parental income not exceeding ₹3,50,000.',
    categoryCriteria: 'General / SC / ST / OBC',
    benefits: '₹12,000 per annum (₹1,000 per month) credited directly to bank account.',
    applicationStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    requiredDocuments: [
      'Class 7/8 marksheets',
      'Income Certificate',
      'Aadhaar / Bank Account passbook copy'
    ],
    applicationProcess: 'Apply on the National Scholarship Portal (NSP) and verify with School Headmaster.',
    officialWebsite: 'https://scholarships.gov.in',
    state: 'All India',
    isDemo: true
  },
  {
    name: 'AICTE Pragati Scholarship for Girls (Technical Degree/Diploma)',
    provider: 'All India Council for Technical Education (AICTE)',
    description: 'Scheme aimed at providing assistance for advancement of girls pursuing technical education (Engineering Degree or Polytechnic Diploma).',
    eligibility: 'Girl students admitted to 1st year of Degree/Diploma level course or 2nd year through lateral entry in AICTE approved institution.',
    educationLevels: ['Diploma / Polytechnic', 'Undergraduate', 'Engineering'],
    stream: ['Engineering', 'Polytechnic'],
    incomeCriteria: 'Family income less than ₹8,00,000 per annum.',
    categoryCriteria: 'Exclusively for Female Students',
    benefits: '₹50,000 per annum for every year of study towards college fee, computer purchase and books.',
    applicationStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    requiredDocuments: [
      'Class 10 & 12 / ITI marksheets',
      'Admission allotment letter for engineering/polytechnic',
      'Annual Income certificate',
      'Tuition fee receipt'
    ],
    applicationProcess: 'Submit online application via National Scholarship Portal (NSP).',
    officialWebsite: 'https://www.aicte-pragati-saksham-gov.in',
    state: 'All India',
    isDemo: true
  },
  {
    name: 'Tata Trust Scholarship for Higher Education',
    provider: 'Sir Ratan Tata Trust & Allied Trusts',
    description: 'Grant program supporting students pursuing undergraduate and postgraduate professional courses like Engineering, Medical, and Applied Sciences.',
    eligibility: 'Students with high academic distinction enrolled in recognized colleges with demonstrated economic need.',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Engineering'],
    stream: ['Science', 'Engineering', 'Medicine'],
    incomeCriteria: 'Annual family income <= ₹6,00,000',
    categoryCriteria: 'Merit-cum-Means',
    benefits: '30% to 80% coverage of actual tuition fee paid to college.',
    applicationStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    requiredDocuments: [
      'College fee receipt',
      'Previous year academic transcript',
      'Income documentation',
      'Identity proof'
    ],
    applicationProcess: 'Apply online through Tata Trusts portal during official window.',
    officialWebsite: 'https://www.tatatrusts.org',
    state: 'All India',
    isDemo: true
  }
];

const courses = [
  {
    name: 'B.Tech in Computer Science and Engineering (with AI & Data Science)',
    category: 'Engineering',
    duration: '4 Years',
    eligibility: '10+2 with Physics, Mathematics, and Chemistry/Computer Science with minimum 50% marks.',
    educationLevels: ['Intermediate / 11th–12th', 'Diploma / Polytechnic'],
    stream: ['MPC / PCM Science', 'Diploma in CS/IT (Lateral Entry)'],
    skills: ['Data Structures', 'Python & C++', 'Machine Learning', 'Cloud Computing', 'Full Stack Development', 'System Design'],
    careerOptions: ['Software Development Engineer', 'AI/ML Engineer', 'Cloud Architect', 'Cybersecurity Analyst', 'Product Manager'],
    higherEducationOptions: ['M.Tech in CS/AI', 'MS in Computer Science abroad', 'MBA in Technology Management'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITS-HD', 'State EAMCET/CETs', 'VITEEE'],
    relatedJobs: ['Frontend Developer', 'Backend Developer', 'Data Scientist', 'DevOps Specialist'],
    isDemo: true
  },
  {
    name: 'Polytechnic Diploma in Mechanical Engineering',
    category: 'Diploma',
    duration: '3 Years (2 Years for ITI Lateral Entry)',
    eligibility: 'Passed Class 10 with Mathematics and Science or ITI 2-year certification.',
    educationLevels: ['Class 10', 'ITI'],
    stream: ['Class 10 General', 'ITI Mechanical/Fitter'],
    skills: ['AutoCAD & SolidWorks', 'Thermodynamics', 'CNC Machining', 'Robotics Basics', 'Quality Control', 'Manufacturing Processes'],
    careerOptions: ['Junior Engineer (JE) in Railways/PWD', 'CAD Designer', 'Production Supervisor', 'Lateral entry to B.Tech 2nd Year'],
    higherEducationOptions: ['B.Tech 2nd Year (Lateral Entry via ECET/JELET)', 'Advanced CAD/CAM Certifications'],
    entranceExams: ['POLYCET', 'State Polytechnic Entrance Test'],
    relatedJobs: ['Maintenance Technician', 'CAD Draftsman', 'Plant Operator'],
    isDemo: true
  },
  {
    name: 'ITI Certificate in Electrician & Solar Technology',
    category: 'ITI',
    duration: '2 Years',
    eligibility: 'Passed Class 10 with Science and Mathematics.',
    educationLevels: ['Class 10'],
    stream: ['Class 10 General'],
    skills: ['Electrical Wiring & Safety', 'Transformer Maintenance', 'Solar Panel Installation', 'Industrial Motor Controls', 'PLC Basics'],
    careerOptions: ['Licensed Electrical Contractor', 'Solar Plant Technician', 'Railway Loco Pilot Assistant', 'State Electricity Board Lineman'],
    higherEducationOptions: ['Polytechnic Diploma (Lateral Entry to 2nd Year)', 'National Craft Instructor Certificate (NCIC)'],
    entranceExams: ['State ITI Merit Admission', 'Direct Admission in NCVT/SCVT Institutes'],
    relatedJobs: ['Electrical Maintenance Technician', 'Control Panel Builder', 'Solar Field Operator'],
    isDemo: true
  },
  {
    name: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
    category: 'Medicine',
    duration: '5.5 Years (including 1 year internship)',
    eligibility: 'Passed 10+2 with Physics, Chemistry, Biology/Biotech with min 50% marks and qualified NEET UG.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['BiPC / PCB Science'],
    skills: ['Clinical Diagnosis', 'Patient Care & Ethics', 'Surgical Procedures', 'Pharmacology', 'Pathology & Anatomy'],
    careerOptions: ['Medical Officer in Govt Hospitals', 'Junior Resident Doctor', 'Private Clinical Practice', 'Medical Research'],
    higherEducationOptions: ['MD / MS Specialization', 'DNB', 'Public Health (MPH)'],
    entranceExams: ['NEET UG', 'USMLE / PLAB for overseas practice'],
    relatedJobs: ['General Physician', 'Emergency Medical Officer', 'Clinical Research Associate'],
    isDemo: true
  },
  {
    name: 'B.Sc in Data Science & Artificial Intelligence',
    category: 'Data Science',
    duration: '3 or 4 Years (Honours)',
    eligibility: '10+2 passed with Mathematics/Statistics/Computer Science.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['Science (PCM)', 'Commerce with Mathematics'],
    skills: ['Python', 'SQL & Relational Databases', 'Statistical Modeling', 'Machine Learning Algorithms', 'PowerBI & Tableau', 'Deep Learning'],
    careerOptions: ['Data Analyst', 'Business Intelligence Developer', 'Associate Data Scientist', 'Financial Quantitative Analyst'],
    higherEducationOptions: ['M.Sc in Data Science', 'MCA', 'Data Science Fellowships'],
    entranceExams: ['CUET UG', 'University Entrance Exams'],
    relatedJobs: ['BI Analyst', 'Data Engineer', 'Marketing Analytics Specialist'],
    isDemo: true
  },
  {
    name: 'Integrated B.A. LL.B (Honours) - Corporate & Cyber Law',
    category: 'Law',
    duration: '5 Years',
    eligibility: 'Passed 10+2 in any stream with minimum 45% aggregate marks.',
    educationLevels: ['Intermediate / 11th–12th'],
    stream: ['Any Stream', 'Arts', 'Commerce', 'Science'],
    skills: ['Legal Drafting & Research', 'Constitutional Law', 'Contract Negotiation', 'Courtroom Advocacy', 'Corporate Governance'],
    careerOptions: ['Corporate Legal Counsel', 'Litigation Advocate', 'Judicial Magistrate (via PCS-J)', 'Legal Advisor in MNCs'],
    higherEducationOptions: ['LL.M in International Law', 'Cyber Law Specialization'],
    entranceExams: ['CLAT', 'AILET', 'SLAT', 'State Law Entrance Exams'],
    relatedJobs: ['Associate Attorney', 'Compliance Officer', 'Legal Researcher'],
    isDemo: true
  }
];

const careers = [
  {
    title: 'Software Development Engineer / AI Engineer',
    sector: 'Information Technology & Software',
    description: 'Design, develop, test, and maintain modern software systems, cloud services, and machine learning models that power global products.',
    requiredEducation: ['Class 10', 'Intermediate (MPC) or Polytechnic Diploma', 'B.Tech/BE in CS/IT or BCA/MCA or B.Sc CS'],
    requiredSkills: ['Problem Solving', 'Data Structures & Algorithms', 'Python / Java / JavaScript', 'Database Architecture', 'System Design'],
    careerPath: [
      { stepNumber: 1, title: 'Class 10 Board', description: 'Focus on Math and Science foundations.', typicalDuration: 'Class 10' },
      { stepNumber: 2, title: 'Intermediate (PCM) or 3-Yr Polytechnic Diploma', description: 'Build strong analytical, physics, and computer fundamentals.', typicalDuration: '2 - 3 Years' },
      { stepNumber: 3, title: 'Entrance Exam (JEE / CET / Lateral Entry)', description: 'Qualify for top engineering or technology colleges.', typicalDuration: 'Preparation Year' },
      { stepNumber: 4, title: 'B.Tech / BCA Degree + Practical Projects', description: 'Participate in hackathons, build open source and web/AI apps, complete internships.', typicalDuration: '3 - 4 Years' },
      { stepNumber: 5, title: 'Junior Software Engineer / Developer', description: 'Work on production codebases, APIs, and feature development.', typicalDuration: 'Entry Level (0-2 Yrs)' },
      { stepNumber: 6, title: 'Senior Engineer / Tech Lead / AI Specialist', description: 'Drive architecture, mentor engineers, and architect high-scale systems.', typicalDuration: '5+ Years' }
    ],
    relatedCourses: ['B.Tech in Computer Science and Engineering', 'B.Sc in Data Science & Artificial Intelligence'],
    relatedExams: ['JEE Main', 'JEE Advanced', 'State EAMCET/CETs'],
    jobRoles: ['Frontend Developer', 'Backend Engineer', 'Full Stack Engineer', 'Machine Learning Engineer', 'DevOps Specialist'],
    averageSalaryRange: '₹6,00,000 - ₹24,00,000+ per annum',
    growthProspects: 'Exceptionally High with global demand',
    isDemo: true
  },
  {
    title: 'Civil Services Officer (IAS / IPS / State Services)',
    sector: 'Government & Public Administration',
    description: 'Lead administrative machinery, maintain public order, implement welfare schemes, and formulate national and state public policies.',
    requiredEducation: ['Class 10', 'Intermediate (Any Stream)', 'Bachelor Degree in Any Discipline from Recognized University'],
    requiredSkills: ['Critical Thinking', 'Administrative Leadership', 'Public Policy Understanding', 'Integrity', 'Communication Skills'],
    careerPath: [
      { stepNumber: 1, title: 'Class 10 & Intermediate', description: 'Develop habit of daily newspaper reading, general awareness, and language clarity.', typicalDuration: 'School & Junior College' },
      { stepNumber: 2, title: 'Graduation in Any Subject', description: 'Pursue BA, B.Sc, B.Com, or B.Tech with focus on academic breadth and optional subject.', typicalDuration: '3 - 4 Years' },
      { stepNumber: 3, title: 'UPSC CSE / State PSC Preparation', description: 'Thorough coverage of NCERTs, standard reference books, answer writing practice.', typicalDuration: '1 - 2 Years' },
      { stepNumber: 4, title: 'Qualify Prelims, Mains & Personality Test', description: 'Clear all 3 stages of competitive examination.', typicalDuration: 'Exam Cycle' },
      { stepNumber: 5, title: 'LBSNAA Training & Assistant Collector', description: 'Foundational training and on-ground field administration training.', typicalDuration: '2 Years' },
      { stepNumber: 6, title: 'District Magistrate / Superintendent of Police / Secretary', description: 'High-responsibility leadership of districts and governmental departments.', typicalDuration: 'Senior Leadership' }
    ],
    relatedCourses: ['Bachelor of Arts in Public Administration / History', 'Any Graduation Degree'],
    relatedExams: ['UPSC Civil Services Examination', 'State Public Service Commission Exams'],
    jobRoles: ['Sub-Divisional Magistrate (SDM)', 'District Collector (DM)', 'Superintendent of Police (IPS)', 'Joint Secretary'],
    averageSalaryRange: '₹56,100 to ₹2,50,000 per month (Plus Govt Perks, Housing, Security)',
    growthProspects: 'Prestigious, influential, stable career with immense social impact',
    isDemo: true
  },
  {
    title: 'Medical Doctor / Healthcare Specialist',
    sector: 'Healthcare & Medicine',
    description: 'Diagnose illnesses, prescribe treatment, perform life-saving surgeries, and advance health research.',
    requiredEducation: ['Class 10', 'Intermediate (BiPC / Physics, Chem, Biology)', 'MBBS', 'MD/MS/DNB Specialization'],
    requiredSkills: ['Empathy', 'Diagnostic Acumen', 'Manual Dexterity', 'Stress Management', 'Lifelong Medical Learning'],
    careerPath: [
      { stepNumber: 1, title: 'Class 10 Pass', description: 'Build strong base in Biology, Chemistry, and Physics.', typicalDuration: 'Class 10' },
      { stepNumber: 2, title: 'Intermediate (11th & 12th BiPC)', description: 'Master NCERT Biology, Organic Chemistry, and Physics.', typicalDuration: '2 Years' },
      { stepNumber: 3, title: 'Qualify NEET UG', description: 'Secure top percentile for admission to Govt Medical College or AIIMS.', typicalDuration: 'Competitive Exam' },
      { stepNumber: 4, title: 'MBBS Course + 1 Year Rotatory Internship', description: 'Hands-on clinical rotations across Surgery, Medicine, Pediatrics, OBGYN.', typicalDuration: '5.5 Years' },
      { stepNumber: 5, title: 'Postgraduate MD / MS Specialization via NEET PG', description: 'Mastering specialized branch (Cardiology, Ortho, Neurology, etc.).', typicalDuration: '3 Years' },
      { stepNumber: 6, title: 'Consultant Specialist / Medical Director', description: 'Lead hospital departments or establish diagnostic hospital centers.', typicalDuration: 'Career Longevity' }
    ],
    relatedCourses: ['Bachelor of Medicine and Bachelor of Surgery (MBBS)', 'B.Sc Nursing', 'BDS Dental'],
    relatedExams: ['NEET UG', 'NEET PG'],
    jobRoles: ['Resident Physician', 'Surgeon', 'Consultant Doctor', 'Medical Superintendent'],
    averageSalaryRange: '₹8,00,000 - ₹35,00,000+ per annum',
    growthProspects: 'Permanent demand, noble profession with immense respect',
    isDemo: true
  },
  {
    title: 'Skilled Industrial Specialist & Automation Technician',
    sector: 'Manufacturing, Heavy Industry & Green Energy',
    description: 'Install, maintain, calibrate, and troubleshoot modern computerized industrial equipment, solar farms, and manufacturing lines.',
    requiredEducation: ['Class 10', 'ITI Certification or 3-Year Polytechnic Diploma in Mechanical/Electrical'],
    requiredSkills: ['Practical Tool Handling', 'Electrical Safety', 'Circuit Schematics', 'PLC Troubleshooting', 'Preventive Maintenance'],
    careerPath: [
      { stepNumber: 1, title: 'Class 10 Board Pass', description: 'Foundation in science and arithmetic.', typicalDuration: 'Class 10' },
      { stepNumber: 2, title: 'ITI Trade (2 Years) or Polytechnic Diploma (3 Years)', description: 'Hands-on workshop training, workshop calculations, and trade practicals.', typicalDuration: '2 - 3 Years' },
      { stepNumber: 3, title: 'National Apprenticeship Scheme (NAPS)', description: 'Industry exposure with stipend in automotive or manufacturing plants.', typicalDuration: '1 Year' },
      { stepNumber: 4, title: 'Junior Technician / Plant Operator', description: 'Perform equipment maintenance and assembly inspection.', typicalDuration: 'Entry Level' },
      { stepNumber: 5, title: 'Maintenance Supervisor / Solar Project Incharge', description: 'Manage shop floor technicians and energy installation safety.', typicalDuration: 'Mid Level' },
      { stepNumber: 6, title: 'Self-Employed Contractor / Industrial Service Head', description: 'Run independent technical contracting enterprise.', typicalDuration: 'Experienced' }
    ],
    relatedCourses: ['ITI Certificate in Electrician & Solar Technology', 'Polytechnic Diploma in Mechanical Engineering'],
    relatedExams: ['POLYCET', 'NAPS Apprenticeship Assessment', 'Railway RRB ALP Exam'],
    jobRoles: ['Industrial Electrician', 'CNC Operator', 'Plant Maintenance Lead', 'Solar Farm Technician'],
    averageSalaryRange: '₹3,00,000 - ₹8,50,000 per annum',
    growthProspects: 'Rapidly rising with Green Energy and Make in India industrial initiatives',
    isDemo: true
  }
];

module.exports = {
  opportunities,
  examinations,
  scholarships,
  courses,
  careers
};
