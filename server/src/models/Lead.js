const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadNumber: {
    type: String,
    unique: true,
    required: true
  },
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
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    default: null
  },
  company: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Email', 'Phone', 'Event', 'Other'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['Closed', 'Ongoing'],
    default: 'Ongoing'
  },
  type: {
    type: String,
    enum: ['Hot', 'Warm', 'Cold'],
    default: 'Cold'
  },
  language: {
    type: String,
    default: 'English'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  followUpDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  budget: {
    type: Number,
    default: null
  },
  expectedValue: {
    type: Number,
    default: null
  },
  dealStage: {
    type: String,
    default: null
  },
  lastContactedDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  leadDate: {
    type: Date,
    default: Date.now
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

// Auto-generate lead number
leadSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Lead').countDocuments();
    this.leadNumber = `LEAD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Create indexes for performance optimization
leadSchema.index({ language: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ language: 1, assignedTo: 1 }); // Compound index for assignment logic

module.exports = mongoose.model('Lead', leadSchema);