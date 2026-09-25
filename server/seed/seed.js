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

    const isReset = process.argv.includes('--reset');

    if (isReset) {
      console.log('[Seed] ⚠️  Running in DESTRUCTIVE RESET mode (--reset). Purging existing collections...');
      await Opportunity.deleteMany({});
      await Examination.deleteMany({});
      await Scholarship.deleteMany({});
      await Course.deleteMany({});
      await Career.deleteMany({});
      await Bookmark.deleteMany({});
      await User.deleteMany({});
      console.log('[Seed] Cleared existing data.');
    } else {
      console.log('[Seed] 🛡️  Running in SAFE NON-DESTRUCTIVE mode. Existing records will be preserved.');
    }

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const studentPassword = await bcrypt.hash('Student@123', salt);

    // 1. Admin and Student Users
    let adminUser = await User.findOne({ email: 'admin@pathfinder.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'PathFinder Admin',
        email: 'admin@pathfinder.com',
        password: adminPassword,
        role: 'admin',
        educationLevel: 'Postgraduate',
        state: 'All India',
        onboardingCompleted: true
      });
      console.log(`[Seed] Created Admin: admin@pathfinder.com / Admin@123`);
    } else {
      console.log(`[Seed] Admin user already exists: admin@pathfinder.com`);
    }

    let studentUser = await User.findOne({ email: 'student@pathfinder.com' });
    if (!studentUser) {
      studentUser = await User.create({
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
        careerInterests: ['Engineering', 'Computer Science', 'Artificial Intelligence'],
        onboardingCompleted: true
      });
      console.log(`[Seed] Created Student: student@pathfinder.com / Student@123`);
    } else {
      console.log(`[Seed] Student user already exists: student@pathfinder.com`);
    }

    // 2. Safe upsert helper function for content collections
    const safeUpsertMany = async (Model, items, keyField, label) => {
      let inserted = 0;
      for (const item of items) {
        const filter = { [keyField]: item[keyField] };
        const existing = await Model.findOne(filter);
        if (!existing) {
          await Model.create(item);
          inserted++;
        }
      }
      console.log(`[Seed] Processed ${label}: ${inserted} new records inserted, ${items.length - inserted} preserved.`);
    };

    if (isReset) {
      await Opportunity.insertMany(opportunities);
      await Examination.insertMany(examinations);
      await Scholarship.insertMany(scholarships);
      await Course.insertMany(courses);
      await Career.insertMany(careers);
      console.log(`[Seed] Reset insertion complete: ${opportunities.length} opps, ${examinations.length} exams, ${scholarships.length} scholarships, ${courses.length} courses, ${careers.length} careers.`);
    } else {
      await safeUpsertMany(Opportunity, opportunities, 'title', 'Opportunities');
      await safeUpsertMany(Examination, examinations, 'name', 'Examinations');
      await safeUpsertMany(Scholarship, scholarships, 'name', 'Scholarships');
      await safeUpsertMany(Course, courses, 'name', 'Courses');
      await safeUpsertMany(Career, careers, 'title', 'Careers');
    }

    // 3. Create a sample bookmark for student if not existing
    const sampleExam = await Examination.findOne({ name: /JEE Main/ });
    if (sampleExam && studentUser) {
      const existingBookmark = await Bookmark.findOne({
        userId: studentUser._id,
        itemId: sampleExam._id
      });
      if (!existingBookmark) {
        await Bookmark.create({
          userId: studentUser._id,
          itemType: 'exam',
          itemId: sampleExam._id
        });
        console.log('[Seed] Created sample bookmark for student.');
      }
    }

    console.log('[Seed] ✅ Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] ❌ Seeding error:`, error.message);
    process.exit(1);
  }
};

seedDB();
