const Attendance = require('../models/Attendance');

// Helper: Get start of day (normalized to midnight UTC)
const getDateKey = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Get today's attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getDateKey();

    let attendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (!attendance) {
      attendance = await Attendance.create({
        userId,
        date: today,
        status: 'Absent'
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Get attendance for specific date (from frontend query param)
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }

    // Parse the date string and get the normalized date (midnight UTC)
    const requestedDate = new Date(date);
    const normalizedDate = getDateKey(requestedDate);

    let attendance = await Attendance.findOne({
      userId,
      date: normalizedDate
    });

    if (!attendance) {
      // Create new attendance record for this date
      attendance = await Attendance.create({
        userId,
        date: normalizedDate,
        status: 'Absent'
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Check In
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getDateKey();

    let attendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (!attendance) {
      // Create new attendance record for today
      attendance = await Attendance.create({
        userId,
        date: today,
        checkIn: new Date(),
        status: 'Present'
      });
    } else if (attendance.checkIn && !attendance.checkOut) {
      // Already checked in today
      return res.status(400).json({ 
        message: 'Already checked in today. Please check out before checking in again.',
        attendance
      });
    } else if (attendance.checkOut) {
      // Already has check-in and check-out for today
      return res.status(400).json({ 
        message: 'Already completed check-in and check-out for today.',
        attendance
      });
    } else {
      // Set check-in time
      attendance.checkIn = new Date();
      attendance.status = 'Present';
      await attendance.save();
    }

    res.status(200).json({ 
      message: 'Checked in successfully', 
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking in', error: error.message });
  }
};

// Check Out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getDateKey();

    let attendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(404).json({ message: 'No check-in found for today. Please check in first.' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ 
        message: 'Already checked out today.',
        attendance
      });
    }

    // Set checkout time
    attendance.checkOut = new Date();

    // Calculate work hours
    if (attendance.checkIn && attendance.checkOut) {
      const workMs = attendance.checkOut - attendance.checkIn;
      const breakMs = attendance.breaks.reduce((sum, br) => {
        if (br.startTime && br.endTime) {
          return sum + (br.endTime - br.startTime);
        }
        return sum;
      }, 0);

      attendance.totalWorkHours = (workMs - breakMs) / (1000 * 60 * 60);
      attendance.totalBreakHours = breakMs / (1000 * 60 * 60);
    }

    await attendance.save();
    
    res.status(200).json({ 
      message: 'Checked out successfully', 
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking out', error: error.message });
  }
};

// Start Break
exports.startBreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    const ongoingBreak = attendance.breaks.find(b => b.startTime && !b.endTime);
    if (ongoingBreak) {
      return res.status(400).json({ message: 'A break is already ongoing' });
    }

    attendance.breaks.push({
      startTime: new Date(),
    });

    await attendance.save();
    res.status(200).json({ message: 'Break started', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error starting break', error: error.message });
  }
};

// End Break
exports.endBreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    const ongoingBreak = attendance.breaks.find(b => b.startTime && !b.endTime);
    if (!ongoingBreak) {
      return res.status(400).json({ message: 'No ongoing break' });
    }

    ongoingBreak.endTime = new Date();
    await attendance.save();

    res.status(200).json({ message: 'Break ended', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error ending break', error: error.message });
  }
};

// Get attendance history
exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const query = { userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance history', error: error.message });
  }
};
