const Employee = require('../models/Employee');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Lead = require('../models/Lead');

// Create Employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, location, preferredLanguage, department, phone } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const employeeId = `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create User account for the employee (password = email)
    const user = new User({
      firstName,
      lastName,
      email,
      password: email, // Password same as email
      role: 'employee'
    });

    await user.save();

    // Create Employee record and link to User
    const employee = new Employee({
      firstName,
      lastName,
      email,
      employeeId,
      location,
      preferredLanguage: preferredLanguage && preferredLanguage.trim() ? preferredLanguage : 'English',
      department,
      phone,
      userId: user._id, // Link to User account
      createdBy: req.user?.id
    });

    await employee.save();

    console.log(`[CREATE EMPLOYEE] Created ${firstName} ${lastName} with preferredLanguage: ${employee.preferredLanguage}`);
    console.log(`[CREATE EMPLOYEE] Created User account for ${email} with password: ${email}`);

    // Log activity
    if (req.user?.id) {
      await Activity.create({
        text: `New employee ${firstName} ${lastName} added`,
        type: 'achievement',
        relatedTo: 'Employee',
        relatedId: employee._id,
        performedBy: req.user.id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Employee and login account created successfully',
      employee,
      loginCredentials: {
        email: email,
        password: email // Let admin know the initial password
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all employees
exports.getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const employees = await Employee.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      employees
    });
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, location, preferredLanguage, department, phone, status, assignedLeads, closedLeads } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        email: email !== undefined ? email : undefined,
        location: location !== undefined ? location : undefined,
        preferredLanguage: preferredLanguage !== undefined ? preferredLanguage : undefined,
        department: department !== undefined ? department : undefined,
        phone: phone !== undefined ? phone : undefined,
        status: status !== undefined ? status : undefined,
        assignedLeads: assignedLeads !== undefined ? assignedLeads : undefined,
        closedLeads: closedLeads !== undefined ? closedLeads : undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
};

// Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete associated User account if exists
    if (employee.userId) {
      await User.findByIdAndDelete(employee.userId);
      console.log(`[DELETE EMPLOYEE] Deleted User account for ${employee.email}`);
    }

    // Log activity
    if (req.user?.id) {
      await Activity.create({
        text: `Employee ${employee.firstName} ${employee.lastName} deleted`,
        type: 'note',
        relatedTo: 'Employee',
        performedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee and login account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get employee statistics
exports.getEmployeeStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const totalAssignedLeads = await Employee.aggregate([
      { $group: { _id: null, total: { $sum: '$assignedLeads' } } }
    ]);
    const totalClosedLeads = await Employee.aggregate([
      { $group: { _id: null, total: { $sum: '$closedLeads' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        totalAssignedLeads: totalAssignedLeads[0]?.total || 0,
        totalClosedLeads: totalClosedLeads[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Recalculate employee stats (for fixing existing data)
exports.recalculateStats = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    
    const updates = await Promise.all(
      employees.map(async (emp) => {
        const assignedLeads = await Lead.countDocuments({ assignedTo: emp._id });
        const closedLeads = await Lead.countDocuments({
          assignedTo: emp._id,
          status: { $in: ['Won', 'Closed'] }
        });

        const conversionRate = assignedLeads > 0 
          ? ((closedLeads / assignedLeads) * 100).toFixed(2)
          : 0;

        // Update employee with correct stats
        return Employee.findByIdAndUpdate(
          emp._id,
          { 
            assignedLeads,
            closedLeads,
            conversionRate
          },
          { new: true }
        );
      })
    );

    res.status(200).json({
      success: true,
      message: `Recalculated stats for ${updates.length} employees`,
      updates
    });
  } catch (error) {
    next(error);
  }
};

// Fix employees with more than 3 leads (data cleanup)
exports.fixLeadViolations = async (req, res, next) => {
  try {
    const MAX_LEADS_PER_EMPLOYEE = 3;
    const employees = await Employee.find();
    
    const violations = [];
    const fixes = [];

    for (const emp of employees) {
      const assignedLeads = await Lead.countDocuments({ assignedTo: emp._id });
      
      if (assignedLeads > MAX_LEADS_PER_EMPLOYEE) {
        const excessCount = assignedLeads - MAX_LEADS_PER_EMPLOYEE;
        violations.push({
          employeeId: emp._id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          currentLeads: assignedLeads,
          excessLeads: excessCount
        });

        // Get the oldest leads to unassign (keep the newest ones)
        const excessLeads = await Lead.find({ assignedTo: emp._id })
          .sort({ createdAt: 1 })
          .limit(excessCount);

        // Unassign these leads
        for (const lead of excessLeads) {
          await Lead.findByIdAndUpdate(
            lead._id,
            { assignedTo: null },
            { new: true }
          );
          fixes.push({
            leadId: lead._id,
            leadName: `${lead.firstName} ${lead.lastName}`,
            unassignedFrom: emp._id
          });
        }

        // Update employee count
        await Employee.findByIdAndUpdate(
          emp._id,
          { assignedLeads: MAX_LEADS_PER_EMPLOYEE },
          { new: true }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Fixed ${violations.length} employees with violations`,
      violations,
      fixes: fixes.length,
      summary: {
        employeesWithViolations: violations.length,
        leadsUnassigned: fixes.length
      }
    });
  } catch (error) {
    next(error);
  }
};
