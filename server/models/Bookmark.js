const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    itemType: {
      type: String,
      required: true,
      enum: ['opportunity', 'exam', 'scholarship', 'course', 'career']
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure a user can only bookmark a specific item once
bookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });
// Fast user bookmark list retrieval index
bookmarkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
