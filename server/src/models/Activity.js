const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['assignment', 'deal', 'lead', 'achievement', 'meeting', 'call', 'email', 'note'],
    default: 'note'
  },
  relatedTo: {
    type: String,
    enum: ['Lead', 'Employee', 'User', 'General'],
    default: 'General'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

// Index for efficient querying
activitySchema.index({ performedBy: 1, timestamp: -1 });
activitySchema.index({ relatedTo: 1, relatedId: 1 });

module.exports = mongoose.model('Activity', activitySchema);
