const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    checkIn: {
      type: Date,
      default: null
    },
    checkOut: {
      type: Date,
      default: null
    },
    breaks: [
      {
        startTime: Date,
        endTime: Date,
        _id: false
      }
    ],
    totalWorkHours: {
      type: Number,
      default: 0
    },
    totalBreakHours: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half-Day', 'On-Leave'],
      default: 'Absent'
    }
  },
  { timestamps: true }
);

// Compound index for user + date (unique per day)
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
