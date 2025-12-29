const Activity = require('../models/Activity');
const Employee = require('../models/Employee');
const Lead = require('../models/Lead');

// Get all activities
exports.getAllActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, relatedTo } = req.query;

    let query = {};
    if (type) query.type = type;
    if (relatedTo) query.relatedTo = relatedTo;

    const activities = await Activity.find(query)
      .populate('performedBy', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ timestamp: -1 });

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      activities
    });
  } catch (error) {
    next(error);
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;

    const activities = await Activity.find()
      .populate('performedBy', 'firstName lastName email')
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get all statistics
    const totalLeads = await Lead.countDocuments();
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    const wonLeads = await Lead.countDocuments({ status: 'Won' });

    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : 0;

    // This week's leads
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const assignedThisWeek = await Lead.countDocuments({
      leadDate: { $gte: thisWeek },
      assignedTo: { $ne: null }
    });

    // Sales data by day
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const salesData = await Lead.aggregate([
      {
        $match: { leadDate: { $gte: last30Days } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$leadDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        unassignedLeads,
        assignedThisWeek,
        activeSalespeople: totalEmployees,
        conversionRate: parseFloat(conversionRate),
        totalLeads,
        totalClosedLeads: wonLeads,
        salesData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get employee performance
exports.getEmployeePerformance = async (req, res, next) => {
  try {
    const employees = await Employee.find().lean();

    const performance = await Promise.all(
      employees.map(async (emp) => {
        const assignedLeads = await Lead.countDocuments({ assignedTo: emp._id });
        const wonLeads = await Lead.countDocuments({
          assignedTo: emp._id,
          status: 'Won'
        });

        return {
          ...emp,
          assignedLeads,
          closedLeads: wonLeads,
          conversionRate: assignedLeads > 0 ? ((wonLeads / assignedLeads) * 100).toFixed(2) : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      performance
    });
  } catch (error) {
    next(error);
  }
};
