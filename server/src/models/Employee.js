const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  employeeId: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  department: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave', 'Terminated'],
    default: 'Active'
  },
  assignedLeads: {
    type: Number,
    default: 0
  },
  closedLeads: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate conversion rate before saving
employeeSchema.pre('save', function(next) {
  if (this.assignedLeads > 0) {
    this.conversionRate = ((this.closedLeads / this.assignedLeads) * 100).toFixed(2);
  }
  next();
});

// Create indexes for performance optimization
employeeSchema.index({ status: 1 });
employeeSchema.index({ preferredLanguage: 1 });
employeeSchema.index({ createdAt: -1 });
employeeSchema.index({ email: 1 }); // For quick lookups

module.exports = mongoose.model('Employee', employeeSchema);
