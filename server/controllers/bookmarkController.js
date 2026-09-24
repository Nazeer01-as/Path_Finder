const Bookmark = require('../models/Bookmark');
const Opportunity = require('../models/Opportunity');
const Examination = require('../models/Examination');
const Scholarship = require('../models/Scholarship');
const Course = require('../models/Course');
const Career = require('../models/Career');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Model map for dynamic item population
const modelMap = {
  opportunity: Opportunity,
  exam: Examination,
  scholarship: Scholarship,
  course: Course,
  career: Career
};

// @desc    Get all bookmarks for logged in user
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user.id }).sort({ createdAt: -1 });

  // Populate item details
  const populatedBookmarks = await Promise.all(
    bookmarks.map(async (b) => {
      const Model = modelMap[b.itemType];
      if (!Model) return null;
      const itemDetails = await Model.findById(b.itemId);
      if (!itemDetails) return null; // In case the item was deleted
      return {
        _id: b._id,
        itemType: b.itemType,
        itemId: b.itemId,
        createdAt: b.createdAt,
        item: itemDetails
      };
    })
  );

  const validBookmarks = populatedBookmarks.filter((b) => b !== null);

  return successResponse(res, 200, 'Bookmarks fetched successfully', validBookmarks);
});

// @desc    Add a bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.addBookmark = asyncHandler(async (req, res) => {
  const { itemType, itemId } = req.body;

  if (!itemType || !itemId) {
    return errorResponse(res, 400, 'Please provide itemType and itemId');
  }

  const Model = modelMap[itemType];
  if (!Model) {
    return errorResponse(res, 400, 'Invalid item type');
  }

  const itemExists = await Model.findById(itemId);
  if (!itemExists) {
    return errorResponse(res, 404, 'The referenced item does not exist');
  }

  // Check if already bookmarked
  const existing = await Bookmark.findOne({
    userId: req.user.id,
    itemType,
    itemId
  });

  if (existing) {
    return errorResponse(res, 409, 'Item is already bookmarked');
  }

  const bookmark = await Bookmark.create({
    userId: req.user.id,
    itemType,
    itemId
  });

  return successResponse(res, 201, 'Bookmarked successfully', bookmark);
});

// @desc    Remove a bookmark by ID or by itemId query
// @route   DELETE /api/bookmarks/:id
// @access  Private
exports.removeBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!bookmark) {
    // Also try finding by itemId if user passed itemId
    const byItemId = await Bookmark.findOneAndDelete({
      itemId: req.params.id,
      userId: req.user.id
    });
    if (!byItemId) {
      return errorResponse(res, 404, 'Bookmark not found');
    }
  }

  return successResponse(res, 200, 'Bookmark removed successfully');
});
