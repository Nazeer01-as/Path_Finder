const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Examination = require('../models/Examination');
const Scholarship = require('../models/Scholarship');
const Course = require('../models/Course');
const Career = require('../models/Career');
const Bookmark = require('../models/Bookmark');

const {
  opportunities,
  examinations,
  scholarships,
  courses,
  careers
} = require('./seedData');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathfinder';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database successfully.');

    // Clear existing collection data
    await Opportunity.deleteMany({});
    await Examination.deleteMany({});
    await Scholarship.deleteMany({});
    await Course.deleteMany({});
    await Career.deleteMany({});
    await Bookmark.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Default Admin & Sample Student
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const studentPassword = await bcrypt.hash('Student@123', salt);

    const adminUser = await User.create({
      name: 'PathFinder Admin',
      email: 'admin@pathfinder.com',
      password: adminPassword,
      role: 'admin',
      educationLevel: 'Postgraduate',
      state: 'All India'
    });

    const studentUser = await User.create({
      name: 'Aarav Sharma',
      email: 'student@pathfinder.com',
      password: studentPassword,
      role: 'student',
      educationLevel: 'Intermediate / 11th–12th',
      classYear: '12th Grade',
      stream: 'Science (MPC)',
      boardOrUniversity: 'CBSE',
      percentageOrCgpa: '88%',
      state: 'Telangana',
      preferredStudyLocation: 'Hyderabad / Bengaluru',
      interests: ['Engineering', 'Computer Science', 'Artificial Intelligence', 'Space Tech'],
      skills: ['Python Basics', 'Mathematics', 'Problem Solving'],
      careerInterests: ['Engineering', 'Computer Science', 'Artificial Intelligence']
    });

    console.log(`[Seed] Created Admin: admin@pathfinder.com / Admin@123`);
    console.log(`[Seed] Created Student: student@pathfinder.com / Student@123`);

    // 2. Insert Opportunities, Exams, Scholarships, Courses, Careers
    await Opportunity.insertMany(opportunities);
    console.log(`[Seed] Inserted ${opportunities.length} opportunities.`);

    await Examination.insertMany(examinations);
    console.log(`[Seed] Inserted ${examinations.length} examinations.`);

    await Scholarship.insertMany(scholarships);
    console.log(`[Seed] Inserted ${scholarships.length} scholarships.`);

    await Course.insertMany(courses);
    console.log(`[Seed] Inserted ${courses.length} courses.`);

    await Career.insertMany(careers);
    console.log(`[Seed] Inserted ${careers.length} careers.`);

    // 3. Create a sample bookmark for student
    const sampleExam = await Examination.findOne({ name: /JEE Main/ });
    if (sampleExam) {
      await Bookmark.create({
        userId: studentUser._id,
        itemType: 'exam',
        itemId: sampleExam._id
      });
      console.log('[Seed] Created sample bookmark for student.');
    }

    console.log('[Seed] ✅ Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] ❌ Seeding error:`, error.message);
    process.exit(1);
  }
};

seedDB();
