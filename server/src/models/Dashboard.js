const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unassignedLeads: {
    type: Number,
    default: 0
  },
  assignedThisWeek: {
    type: Number,
    default: 0
  },
  activeSalespeople: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },
  totalLeads: {
    type: Number,
    default: 0
  },
  totalClosedLeads: {
    type: Number,
    default: 0
  },
  weeklyStats: [{
    date: Date,
    leadsAdded: Number,
    leadsConverted: Number,
    revenue: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
