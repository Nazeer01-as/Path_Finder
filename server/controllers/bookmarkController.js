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

// @desc    Get all bookmarks for logged in user (optimized batched queries, no N+1)
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user.id }).sort({ createdAt: -1 });
  if (bookmarks.length === 0) {
    return successResponse(res, 200, 'Bookmarks fetched successfully', []);
  }

  // 1. Group itemIds by itemType for batched querying
  const idsByType = {};
  bookmarks.forEach((b) => {
    if (!idsByType[b.itemType]) {
      idsByType[b.itemType] = [];
    }
    idsByType[b.itemType].push(b.itemId);
  });

  // 2. Query each model once in batch (at most 5 queries instead of N)
  const itemMapByType = {};
  await Promise.all(
    Object.keys(idsByType).map(async (type) => {
      const Model = modelMap[type];
      if (!Model) return;
      // Filter out permanently deleted or deactivated items to prevent broken references
      const items = await Model.find({
        _id: { $in: idsByType[type] },
        isActive: { $ne: false }
      });
      const map = new Map();
      items.forEach((item) => {
        map.set(item._id.toString(), item);
      });
      itemMapByType[type] = map;
    })
  );

  // 3. Map back in original sort order
  const validBookmarks = [];
  for (const b of bookmarks) {
    const typeMap = itemMapByType[b.itemType];
    const itemDetails = typeMap ? typeMap.get(b.itemId.toString()) : null;
    if (itemDetails) {
      validBookmarks.push({
        _id: b._id,
        itemType: b.itemType,
        itemId: b.itemId,
        createdAt: b.createdAt,
        item: itemDetails
      });
    }
  }

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
