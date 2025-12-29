const Employee = require('../models/Employee');
const Activity = require('../models/Activity');

// Create Employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, location, preferredLanguage, department, phone } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const employeeId = `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const employee = new Employee({
      firstName,
      lastName,
      email,
      employeeId,
      location,
      preferredLanguage: preferredLanguage && preferredLanguage.trim() ? preferredLanguage : 'English',
      department,
      phone,
      createdBy: req.user?.id
    });

    await employee.save();

    console.log(`[CREATE EMPLOYEE] Created ${firstName} ${lastName} with preferredLanguage: ${employee.preferredLanguage}`);

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
      message: 'Employee created successfully',
      employee
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
      message: 'Employee deleted successfully'
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
