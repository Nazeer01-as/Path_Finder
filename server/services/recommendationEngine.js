const Opportunity = require('../models/Opportunity');
const Examination = require('../models/Examination');
const Scholarship = require('../models/Scholarship');
const Course = require('../models/Course');
const Career = require('../models/Career');

/**
 * Domain alias mapping for normalization (case, spacing, acronyms)
 */
const ALIAS_MAP = {
  'ai': 'artificial intelligence',
  'artificial intelligence': 'artificial intelligence',
  'cs': 'computer science',
  'computer science': 'computer science',
  'it': 'information technology',
  'information technology': 'information technology',
  'ml': 'machine learning',
  'machine learning': 'machine learning',
  'engg': 'engineering',
  'engineering': 'engineering',
  'math': 'mathematics',
  'maths': 'mathematics',
  'mathematics': 'mathematics',
  'govt': 'government',
  'government': 'government',
  'inter': 'intermediate',
  '12th': 'intermediate',
  '11th': 'intermediate',
  '10th': 'class 10'
};

const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const getAliases = (token) => {
  const norm = normalizeText(token);
  const canonical = ALIAS_MAP[norm] || norm;
  const set = new Set([norm, canonical]);
  for (const [k, v] of Object.entries(ALIAS_MAP)) {
    if (v === canonical || v === norm) set.add(k);
  }
  return [...set];
};

const matchesToken = (source, targetToken) => {
  if (!source || !targetToken) return false;
  const normSource = normalizeText(source);
  const targetAliases = getAliases(targetToken);
  return targetAliases.some((alias) => alias && normSource.includes(alias));
};

/**
 * Rule-based recommendation engine for students.
 * Flow: Student Profile -> Hard Eligibility Filtering -> Matching/Scoring -> Ranking -> Structured Explanation
 */
class RecommendationEngine {
  /**
   * Hard Eligibility Filter: verifies mandatory eligibility constraints based on actual model fields.
   */
  static checkEligibility(item, user, itemType) {
    const userEdu = normalizeText(user.educationLevel || '');
    const userStream = normalizeText(user.stream || '');
    const userState = normalizeText(user.state || '');
    const warnings = [];

    // 1. Education Level Check
    const itemEduLevels = (item.educationLevels || item.requiredEducation || [])
      .map((e) => normalizeText(e))
      .filter(Boolean);

    if (userEdu && itemEduLevels.length > 0) {
      const eduMatch = itemEduLevels.some((e) => {
        return matchesToken(e, userEdu) || matchesToken(userEdu, e);
      });
      if (!eduMatch) {
        return {
          eligible: false,
          reasons: [`Requires qualification matching: ${itemEduLevels.join(', ')}`],
          warnings
        };
      }
    }

    // 2. State / Location Eligibility Check
    const itemLocation = normalizeText(item.state || item.location || '');
    const isPanIndia =
      !itemLocation ||
      itemLocation.includes('all india') ||
      itemLocation.includes('online') ||
      itemLocation.includes('pan india');

    if (userState && !isPanIndia) {
      const stateMatch = itemLocation.includes(userState) || userState.includes(itemLocation);
      if (!stateMatch) {
        return {
          eligible: false,
          reasons: [`Restricted to applicants from: ${item.state || item.location}`],
          warnings
        };
      }
    }

    // 3. Stream Filter Check
    const itemStreams = (item.stream || []).map((s) => normalizeText(s)).filter(Boolean);
    if (userStream && itemStreams.length > 0) {
      const isGenericStream = itemStreams.some(
        (s) => s.includes('any') || s.includes('all') || s.includes('general')
      );
      if (!isGenericStream) {
        const streamMatch = itemStreams.some(
          (s) => matchesToken(s, userStream) || matchesToken(userStream, s)
        );
        if (!streamMatch) {
          return {
            eligible: false,
            reasons: [`Tailored strictly for ${itemStreams.join(', ')} stream`],
            warnings
          };
        }
      }
    }

    return {
      eligible: true,
      reasons: ['Satisfies prerequisite eligibility criteria'],
      warnings
    };
  }

  /**
   * Scoring Logic with Normalized Matching and Explanation Generation
   */
  static scoreItem(item, user, itemType) {
    let score = 0;
    const reasons = [];
    const warnings = [];

    const userEdu = user.educationLevel || '';
    const userStream = user.stream || '';
    const userInterests = user.interests || [];
    const userSkills = user.skills || [];
    const userCareerInterests = user.careerInterests || [];
    const userState = user.state || '';

    // 1. Education Level Match (+40 points)
    const eduLevels = item.educationLevels || [];
    const reqEdu = item.requiredEducation || [];
    const matchedEdu = [...eduLevels, ...reqEdu].find(
      (e) => matchesToken(e, userEdu) || matchesToken(userEdu, e)
    );
    if (matchedEdu) {
      score += 40;
      reasons.push(`Directly aligned with your education level (${user.educationLevel})`);
    }

    // 2. Stream Match (+25 points)
    const streams = item.stream || [];
    if (userStream) {
      const matchedStream = streams.find(
        (s) =>
          matchesToken(s, userStream) ||
          matchesToken(userStream, s) ||
          normalizeText(s) === 'any' ||
          normalizeText(s) === 'all'
      );
      if (matchedStream) {
        score += 25;
        reasons.push(`Tailored for students from ${user.stream} stream`);
      }
    }

    // 3. Career Interest & Category Match (+20 points)
    const itemTitle = item.title || item.name || '';
    const itemCategory = item.category || item.sector || '';
    const itemDesc = item.description || '';

    const matchedCareer = userCareerInterests.find(
      (c) =>
        matchesToken(itemTitle, c) ||
        matchesToken(itemCategory, c) ||
        matchesToken(itemDesc, c)
    );
    if (matchedCareer) {
      score += 20;
      reasons.push(`Connects to your career interest in ${matchedCareer}`);
    }

    // 4. Interests / Skills / Tags overlap (+15 points)
    const itemTags = item.tags || item.skills || item.skillsLearned || [];
    const allUserTokens = [...userInterests, ...userSkills];
    const matchedToken = allUserTokens.find(
      (token) =>
        itemTags.some((tag) => matchesToken(tag, token) || matchesToken(token, tag)) ||
        matchesToken(itemDesc, token)
    );
    if (matchedToken) {
      score += 15;
      reasons.push(`Matches your interest in ${matchedToken}`);
    }

    // 5. State / Location Match (+5 points)
    const itemLoc = item.location || item.state || '';
    if (userState && (matchesToken(itemLoc, userState) || normalizeText(itemLoc).includes('all india'))) {
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

    if (reasons.length === 0) {
      reasons.push('Popular opportunity matching your broad profile');
    }

    return {
      score,
      matchReason: reasons.slice(0, 2).join(' • '),
      explanation: {
        score,
        reasons,
        eligibility: {
          eligible: true
        },
        warnings
      }
    };
  }

  /**
   * Generates ranked recommendations by evaluating all active candidates through
   * hard eligibility filtering, scoring, sorting, and returning controlled top N sets.
   */
  static async getRecommendations(user) {
    // Fetch all active records (no arbitrary 20 record bottleneck)
    const [opps, exams, scholarships, courses, careers] = await Promise.all([
      Opportunity.find({ isActive: true }).lean(),
      Examination.find({ isActive: true }).lean(),
      Scholarship.find({ isActive: true }).lean(),
      Course.find({ isActive: true }).lean(),
      Career.find({ isActive: true }).lean()
    ]);

    const filterScoreAndRank = (items, type) => {
      return items
        .filter((item) => {
          // Hard eligibility filtering layer
          const { eligible } = RecommendationEngine.checkEligibility(item, user, type);
          return eligible;
        })
        .map((item) => {
          const { score, matchReason, explanation } = RecommendationEngine.scoreItem(
            item,
            user,
            type
          );
          return {
            ...item,
            itemType: type,
            score,
            matchReason,
            explanation,
            recommendationBadge: 'Based on your profile'
          };
        })
        .sort((a, b) => b.score - a.score);
    };

    const scoredOpps = filterScoreAndRank(opps, 'opportunity');
    const scoredExams = filterScoreAndRank(exams, 'exam');
    const scoredScholarships = filterScoreAndRank(scholarships, 'scholarship');
    const scoredCourses = filterScoreAndRank(courses, 'course');
    const scoredCareers = filterScoreAndRank(careers, 'career');

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
