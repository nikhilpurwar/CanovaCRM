const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const Employee = require('../models/Employee');

// Lead assignment round-robin trackers (in memory - resets on server restart)
// For production, consider storing in database
const roundRobinTrackers = new Map();

// Helper function: Assign lead based on language with proper round-robin and threshold
const assignLeadToEmployee = async (language) => {
  try {
    console.log(`\n[LEAD ASSIGNMENT] === Starting assignment for language: "${language}" ===`);
    
    // STEP 1: Find employees with EXACT language match ONLY
    let employees = await Employee.find({ 
      status: 'Active',
      preferredLanguage: language
    });

    console.log(`[LEAD ASSIGNMENT] Step 1: Found ${employees.length} employees with EXACT language match "${language}"`);

    // STEP 2: If no employees with same language, return unassigned
    // Do NOT fallback to other languages - respect language boundaries
    if (employees.length === 0) {
      console.log(`[LEAD ASSIGNMENT] ERROR: No active employees with language "${language}" - lead will remain UNASSIGNED`);
      return null;
    }

    console.log(`[LEAD ASSIGNMENT] Total employees to consider: ${employees.length}`);

    // STEP 3: Get lead counts for each employee
    const MAX_LEADS_PER_EMPLOYEE = 3;
    
    const employeeLeadCounts = await Promise.all(
      employees.map(async (emp) => {
        const count = await Lead.countDocuments({ assignedTo: emp._id });
        console.log(`  - ${emp.firstName} ${emp.lastName} (${emp.preferredLanguage}): ${count} leads`);
        return { 
          empId: emp._id, 
          count, 
          name: `${emp.firstName} ${emp.lastName}`,
          language: emp.preferredLanguage,
          isFull: count >= MAX_LEADS_PER_EMPLOYEE
        };
      })
    );

    // STEP 4: Find employees with available capacity (< 3 leads)
    const availableEmployees = employeeLeadCounts.filter(e => e.count < MAX_LEADS_PER_EMPLOYEE);
    
    console.log(`[LEAD ASSIGNMENT] Step 4: Available employees (< ${MAX_LEADS_PER_EMPLOYEE} leads): ${availableEmployees.length}`);
    
    if (availableEmployees.length === 0) {
      console.log(`[LEAD ASSIGNMENT] ERROR: All employees already have ${MAX_LEADS_PER_EMPLOYEE} leads - lead will remain UNASSIGNED`);
      return null;
    }

    // STEP 5: Use ROUND-ROBIN to distribute among available employees
    if (!roundRobinTrackers.has(language)) {
      roundRobinTrackers.set(language, 0);
    }
    
    let currentIndex = roundRobinTrackers.get(language);
    
    // Sort by lead count first (assign to those with fewer leads)
    availableEmployees.sort((a, b) => a.count - b.count);
    
    // Find employees with minimum lead count
    const minCount = Math.min(...availableEmployees.map(e => e.count));
    const candidatesWithMinCount = availableEmployees.filter(e => e.count === minCount);
    
    // Use round-robin on candidates with minimum count
    const selectedEmployee = candidatesWithMinCount[currentIndex % candidatesWithMinCount.length];
    currentIndex = (currentIndex + 1) % candidatesWithMinCount.length;
    roundRobinTrackers.set(language, currentIndex);
    
    console.log(`[LEAD ASSIGNMENT] ✓ Assigned to ${selectedEmployee.name} (${selectedEmployee.language}) with ${selectedEmployee.count} leads [RR Index: ${currentIndex - 1}]`);

    return selectedEmployee.empId;
  } catch (error) {
    console.error('[LEAD ASSIGNMENT] ERROR:', error.message);
    return null;
  }
};

// Create Lead
exports.createLead = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, company, location, source, status, type, language, assignedTo, notes, scheduledDate } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    console.log(`\n[CREATE LEAD] Creating lead for ${firstName} ${lastName}, language: ${language}`);

    // Auto-generate leadNumber
    const count = await Lead.countDocuments();
    const leadNumber = `LEAD-${Date.now()}-${count + 1}`;

    // If assignedTo not provided, auto-assign based on language
    let finalAssignment = assignedTo || null;
    if (!assignedTo && language) {
      console.log(`[CREATE LEAD] No manual assignment, attempting auto-assignment`);
      finalAssignment = await assignLeadToEmployee(language);
      console.log(`[CREATE LEAD] Auto-assignment result: ${finalAssignment ? 'assigned' : 'unassigned'}`);
    }

    const lead = new Lead({
      leadNumber,
      firstName,
      lastName,
      email,
      phone,
      company,
      location,
      source,
      status: status || 'Ongoing',
      type,
      language,
      assignedTo: finalAssignment,
      notes,
      scheduledDate,
      createdBy: req.user?.id
    });

    await lead.save();
    await lead.populate('assignedTo', 'firstName lastName email');

    // Update employee's assignedLeads counter if assigned
    if (finalAssignment) {
      await Employee.findByIdAndUpdate(
        finalAssignment,
        { $inc: { assignedLeads: 1 } },
        { new: true }
      );
      console.log(`[CREATE LEAD] Updated assignedLeads counter for employee`);
    }

    // Log activity
    if (req.user?.id) {
      const activityText = finalAssignment 
        ? `New lead ${firstName} ${lastName} created and assigned`
        : `New lead ${firstName} ${lastName} created (unassigned)`;
      
      await Activity.create({
        text: activityText,
        type: 'lead',
        relatedTo: 'Lead',
        relatedId: lead._id,
        performedBy: req.user.id
      });
    }


    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
};

// Get all leads
exports.getAllLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', status, type, assignedTo, assignedToMe } = req.query;

    let query = {};
    
    // If assignedToMe is true, get leads assigned to current user's employee record
    if (assignedToMe === 'true' || assignedToMe === true) {
      try {
        // Find the employee record for the current user
        const employee = await Employee.findOne({ userId: req.user.id });
        if (employee) {
          query.assignedTo = employee._id;
          console.log(`[GET LEADS] Filter by assignedToMe - User: ${req.user.id}, Employee: ${employee._id}`);
        } else {
          console.log(`[GET LEADS] No employee found for user: ${req.user.id}`);
          // Return empty leads array if user is not an employee
          return res.status(200).json({
            success: true,
            count: 0,
            total: 0,
            page,
            pages: 0,
            leads: []
          });
        }
      } catch (err) {
        console.error('[GET LEADS] Error finding employee:', err);
      }
    } else if (assignedTo) {
      // Specific employee ID provided
      query.assignedTo = assignedTo;
    }
    
    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
      // Flatten the query
      const tempQuery = { ...query };
      query = { $and: [{ ...tempQuery }] };
      if (search) {
        query.$and.push({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } }
          ]
        });
      }
      // Simplify: just merge search into query
      if (assignedToMe === 'true' || assignedToMe === true || assignedTo) {
        const assignQuery = query.assignedTo ? { assignedTo: query.assignedTo } : {};
        query = {
          ...assignQuery,
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } }
          ]
        };
      }
    }

    if (status) query.status = status;
    if (type) query.type = type;

    const leads = await Lead.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ leadDate: -1 });

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      leads
    });
  } catch (error) {
    next(error);
  }
};

// Get lead by ID
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'firstName lastName email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      lead
    });
  } catch (error) {
    next(error);
  }
};

// Update lead
exports.updateLead = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, company, location, source, status, type, language, assignedTo, notes, scheduledDate, followUpDate } = req.body;

    // Get the current lead to check previous status
    const currentLead = await Lead.findById(req.params.id);
    if (!currentLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        company: company !== undefined ? company : undefined,
        location: location !== undefined ? location : undefined,
        source: source !== undefined ? source : undefined,
        status: status !== undefined ? status : undefined,
        type: type !== undefined ? type : undefined,
        language: language !== undefined ? language : undefined,
        assignedTo: assignedTo !== undefined ? assignedTo : undefined,
        notes: notes !== undefined ? notes : undefined,
        scheduledDate: scheduledDate !== undefined ? scheduledDate : undefined,
        followUpDate: followUpDate !== undefined ? followUpDate : undefined,
        lastContactedDate: Date.now(),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Update employee counters if status changed to Won or Closed
    if (status && status !== currentLead.status && lead.assignedTo) {
      const closingStatuses = ['Won', 'Closed'];
      const wasOpen = !closingStatuses.includes(currentLead.status);
      const isClosed = closingStatuses.includes(status);

      if (wasOpen && isClosed) {
        // Lead is being closed, increment closedLeads
        await Employee.findByIdAndUpdate(
          lead.assignedTo._id || lead.assignedTo,
          { $inc: { closedLeads: 1 } },
          { new: true }
        );
      } else if (!wasOpen && !isClosed) {
        // Lead is being reopened, decrement closedLeads
        await Employee.findByIdAndUpdate(
          lead.assignedTo._id || lead.assignedTo,
          { $inc: { closedLeads: -1 } },
          { new: true }
        );
      }
    }

    // Log activity if status changed
    if (status && req.user?.id) {
      await Activity.create({
        text: `Lead status updated to ${status}`,
        type: 'note',
        relatedTo: 'Lead',
        relatedId: lead._id,
        performedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
};

// Delete lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Decrement assignedLeads counter if lead was assigned
    if (lead.assignedTo) {
      await Employee.findByIdAndUpdate(
        lead.assignedTo,
        { $inc: { assignedLeads: -1 } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Assign lead to employee
exports.assignLead = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    // Get the current lead to check previous assignment
    const currentLead = await Lead.findById(req.params.id);
    if (!currentLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Get the employee to assign to
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // VALIDATION 1: Check language compatibility
    if (employee.preferredLanguage !== currentLead.language) {
      return res.status(400).json({ 
        message: `Cannot assign this lead. Employee speaks ${employee.preferredLanguage} but lead is ${currentLead.language}.`,
        employeeLanguage: employee.preferredLanguage,
        leadLanguage: currentLead.language
      });
    }

    // VALIDATION 2: Check if employee already has 3 leads (unless reassigning from same employee)
    const currentAssignedLeads = await Lead.countDocuments({ assignedTo });
    const MAX_LEADS_PER_EMPLOYEE = 3;
    
    if (currentAssignedLeads >= MAX_LEADS_PER_EMPLOYEE && 
        (!currentLead.assignedTo || currentLead.assignedTo.toString() !== assignedTo)) {
      return res.status(400).json({ 
        message: `Cannot assign this lead. Employee ${employee.firstName} ${employee.lastName} already has ${MAX_LEADS_PER_EMPLOYEE} leads (maximum allowed).`,
        currentLeadsCount: currentAssignedLeads,
        maxLeads: MAX_LEADS_PER_EMPLOYEE
      });
    }

    // Update the lead
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo, lastContactedDate: Date.now() },
      { new: true }
    ).populate('assignedTo', 'firstName lastName email');

    // Update employee counters
    // Decrement previous employee if reassigned
    if (currentLead.assignedTo && currentLead.assignedTo.toString() !== assignedTo) {
      await Employee.findByIdAndUpdate(
        currentLead.assignedTo,
        { $inc: { assignedLeads: -1 } },
        { new: true }
      );
    }

    // Increment new employee if not previously assigned
    if (!currentLead.assignedTo || currentLead.assignedTo.toString() !== assignedTo) {
      await Employee.findByIdAndUpdate(
        assignedTo,
        { $inc: { assignedLeads: 1 } },
        { new: true }
      );
    }

    // Log activity
    if (req.user?.id) {
      await Activity.create({
        text: `Lead assigned to ${lead.assignedTo?.firstName}`,
        type: 'assignment',
        relatedTo: 'Lead',
        relatedId: lead._id,
        performedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead assigned successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
};

// Get lead statistics
exports.getLeadStats = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });
    const wonLeads = await Lead.countDocuments({ status: 'Won' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const leadsThisWeek = await Lead.countDocuments({ leadDate: { $gte: thisWeek } });

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        unassignedLeads,
        wonLeads,
        lostLeads,
        leadsThisWeek
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk create leads from CSV
exports.bulkCreateLeads = async (req, res, next) => {
  try {
    const { leads } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of leads' });
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'language', 'source', 'location'];
    const invalidLeads = leads.filter(lead => 
      requiredFields.some(field => !lead[field])
    );

    if (invalidLeads.length > 0) {
      return res.status(400).json({ 
        message: `${invalidLeads.length} leads have missing required fields`,
        details: 'Required: firstName, lastName, email, language, source, location'
      });
    }

    // Get leadNumber counter
    const existingCount = await Lead.countDocuments();

    // Create lead objects with auto-assignment using Promise.all
    const leadsWithAssignment = await Promise.all(
      leads.map(async (leadData, index) => {
        const leadNumber = `LEAD-${Date.now()}-${existingCount + index + 1}`;
        
        // Auto-assign based on language
        const assignedTo = await assignLeadToEmployee(leadData.language);

        return {
          ...leadData,
          leadNumber,
          status: 'Ongoing',
          assignedTo,
          createdBy: req.user?.id,
          leadDate: leadData.leadDate || new Date()
        };
      })
    );

    // Bulk insert all leads in parallel
    const createdLeads = await Lead.insertMany(leadsWithAssignment);

    // Update employee assignedLeads counters
    const employeeCounters = {};
    createdLeads.forEach(lead => {
      if (lead.assignedTo) {
        const empId = lead.assignedTo.toString();
        employeeCounters[empId] = (employeeCounters[empId] || 0) + 1;
      }
    });

    // Update all employees with their new lead counts in parallel
    await Promise.all(
      Object.entries(employeeCounters).map(([empId, count]) =>
        Employee.findByIdAndUpdate(
          empId,
          { $inc: { assignedLeads: count } },
          { new: true }
        )
      )
    );
    console.log(`[BULK CREATE] Updated employee counters:`, employeeCounters);

    // Create activity entries for each lead (parallel)
    if (req.user?.id) {
      await Promise.all(
        createdLeads.map(lead =>
          Activity.create({
            text: `Lead ${lead.firstName} ${lead.lastName} created from CSV bulk import`,
            type: 'lead',
            relatedTo: 'Lead',
            relatedId: lead._id,
            performedBy: req.user.id
          })
        )
      );
    }

    // Populate assignedTo details
    const populatedLeads = await Lead.find({ 
      _id: { $in: createdLeads.map(l => l._id) }
    }).populate('assignedTo', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: `${createdLeads.length} leads created successfully from CSV`,
      count: createdLeads.length,
      leads: populatedLeads
    });
  } catch (error) {
    next(error);
  }
};
