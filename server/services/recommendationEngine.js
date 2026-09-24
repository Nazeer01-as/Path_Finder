const Opportunity = require('../models/Opportunity');
const Examination = require('../models/Examination');
const Scholarship = require('../models/Scholarship');
const Course = require('../models/Course');
const Career = require('../models/Career');

/**
 * Rule-based recommendation engine for students.
 * Analyzes student educationLevel, stream, interests, skills, and careerInterests.
 * Computes match score and generates human-readable match explanations.
 */
class RecommendationEngine {
  static scoreItem(item, user, itemType) {
    let score = 0;
    const reasons = [];

    const userEdu = (user.educationLevel || '').toLowerCase();
    const userStream = (user.stream || '').toLowerCase();
    const userInterests = (user.interests || []).map((i) => i.toLowerCase());
    const userSkills = (user.skills || []).map((s) => s.toLowerCase());
    const userCareerInterests = (user.careerInterests || []).map((c) => c.toLowerCase());
    const userState = (user.state || '').toLowerCase();

    // 1. Education Level Match (+40 points)
    const eduLevels = (item.educationLevels || []).map((e) => e.toLowerCase());
    if (eduLevels.some((e) => userEdu.includes(e) || e.includes(userEdu))) {
      score += 40;
      reasons.push(`Directly aligned with your education level (${user.educationLevel})`);
    } else if (item.requiredEducation && item.requiredEducation.some((e) => userEdu.includes(e.toLowerCase()) || e.toLowerCase().includes(userEdu))) {
      score += 40;
      reasons.push(`Matches prerequisite education (${user.educationLevel})`);
    }

    // 2. Stream Match (+25 points)
    const streams = (item.stream || []).map((s) => s.toLowerCase());
    if (userStream && (streams.some((s) => s.includes(userStream) || userStream.includes(s) || s === 'any' || s === 'all'))) {
      score += 25;
      reasons.push(`Tailored for students from ${user.stream} stream`);
    }

    // 3. Career Interest & Category Match (+20 points)
    const itemTitle = (item.title || item.name || '').toLowerCase();
    const itemCategory = (item.category || item.sector || '').toLowerCase();
    const itemDesc = (item.description || '').toLowerCase();

    const matchedCareer = userCareerInterests.find(
      (c) => itemTitle.includes(c) || itemCategory.includes(c) || itemDesc.includes(c)
    );
    if (matchedCareer) {
      score += 20;
      reasons.push(`Connects to your career interest in ${matchedCareer}`);
    }

    // 4. Interests / Skills / Tags overlap (+15 points)
    const itemTags = (item.tags || item.skills || item.skillsLearned || []).map((t) => t.toLowerCase());
    const allUserTokens = [...userInterests, ...userSkills];
    const matchedToken = allUserTokens.find(
      (token) => itemTags.some((tag) => tag.includes(token) || token.includes(tag)) || itemDesc.includes(token)
    );
    if (matchedToken) {
      score += 15;
      reasons.push(`Matches your interest in ${matchedToken}`);
    }

    // 5. State / Location Match (+5 points)
    const itemLoc = (item.location || item.state || '').toLowerCase();
    if (userState && (itemLoc.includes(userState) || itemLoc.includes('all india'))) {
      score += 5;
    }

    // 6. Deadline urgency boost (up to +10 points if closing within 30 days)
    const deadline = item.deadline || item.applicationLastDate;
    if (deadline) {
      const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0 && daysLeft <= 15) {
        score += 10;
        reasons.push(`Urgent: Applications close in ${daysLeft} days`);
      } else if (daysLeft > 15 && daysLeft <= 30) {
        score += 5;
      }
    }

    // Default reason if score was gained primarily by general match
    if (reasons.length === 0) {
      reasons.push('Popular opportunity matching your broad profile');
    }

    return {
      score,
      matchReason: reasons.slice(0, 2).join(' • ')
    };
  }

  static async getRecommendations(user) {
    const [opps, exams, scholarships, courses, careers] = await Promise.all([
      Opportunity.find({ isActive: true }).limit(20),
      Examination.find({ isActive: true }).limit(20),
      Scholarship.find({ isActive: true }).limit(20),
      Course.find({ isActive: true }).limit(20),
      Career.find({ isActive: true }).limit(20)
    ]);

    const scoreAndMap = (items, type) => {
      return items
        .map((item) => {
          const { score, matchReason } = RecommendationEngine.scoreItem(item, user, type);
          return {
            ...item.toObject(),
            itemType: type,
            score,
            matchReason,
            recommendationBadge: 'Based on your profile'
          };
        })
        .sort((a, b) => b.score - a.score);
    };

    const scoredOpps = scoreAndMap(opps, 'opportunity');
    const scoredExams = scoreAndMap(exams, 'exam');
    const scoredScholarships = scoreAndMap(scholarships, 'scholarship');
    const scoredCourses = scoreAndMap(courses, 'course');
    const scoredCareers = scoreAndMap(careers, 'career');

    // Combine top recommendations for the dashboard
    const topRecommended = [
      ...scoredOpps.slice(0, 3),
      ...scoredExams.slice(0, 2),
      ...scoredScholarships.slice(0, 2),
      ...scoredCourses.slice(0, 2),
      ...scoredCareers.slice(0, 2)
    ].sort((a, b) => b.score - a.score);

    return {
      topRecommended,
      opportunities: scoredOpps.slice(0, 6),
      examinations: scoredExams.slice(0, 6),
      scholarships: scoredScholarships.slice(0, 6),
      courses: scoredCourses.slice(0, 6),
      careers: scoredCareers.slice(0, 6)
    };
  }
}

module.exports = RecommendationEngine;
