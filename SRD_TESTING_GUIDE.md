# SRD Compliance - Comprehensive Testing Guide

**Purpose**: Step-by-step instructions to verify all SRD requirements are working correctly

---

## SETUP FOR TESTING

### Prerequisites
1. Backend running on http://localhost:5000
2. Admin Client running on http://localhost:5173
3. Employee Client running on http://localhost:5174
4. MongoDB connected and accessible
5. Fresh database (recommended for clean testing)

### Initial Setup
```bash
# 1. Register Admin (on admin client)
- Navigate to http://localhost:5173
- Click "Register as Admin"
- Enter: Name: Test Admin, Email: admin@test.com, Password: admin123
- Admin Secret Key: admin123
- Register

# 2. Login as Admin
- Email: admin@test.com
- Password: admin123
- Click Login
- Should see Dashboard

# 3. Create Employees (for testing)
- Go to Employees tab
- Add 3 employees:
  Employee 1: Rajesh Mehta, rajesh@test.com, Language: English, Phone: 9999999991
  Employee 2: Priya Singh, priya@test.com, Language: Hindi, Phone: 9999999992
  Employee 3: Amit Kumar, amit@test.com, Language: Marathi, Phone: 9999999993
```

---

## TEST SUITE 1: DASHBOARD MODULE

### TEST 1.1: Dashboard Cards - Unassigned Leads Count
**Requirement**: Display total leads not mapped to any user

**Steps**:
1. Go to Dashboard
2. Note "Unassigned Leads" card value (should be 0 initially)
3. Create 5 leads manually without assigning:
   - Name: Lead1-5, Email: lead1-5@test.com, Language: English, Source: Website, Location: Mumbai, Date: Today
   - DON'T select "Assign to" (leave empty)
4. **Expected**: Card should show 5 unassigned leads
5. Assign 2 leads to an employee
6. **Expected**: Card should now show 3 unassigned leads
7. **Status**: ✅ PASS if count decreases correctly

**Evidence**: Take screenshot of card showing correct count

---

### TEST 1.2: Dashboard Cards - Assigned This Week Count
**Requirement**: Display leads assigned in the current week

**Steps**:
1. Dashboard should show "Assigned This Week" card
2. Note current value
3. Create 10 leads and assign them all to employees
4. **Expected**: "Assigned This Week" card should increment by 10
5. Try assigning lead with past date (>7 days old)
6. **Expected**: Past date leads should NOT be counted in "This Week"
7. **Status**: ✅ PASS if only current week leads are counted

**Evidence**: Screenshot of cards

---

### TEST 1.3: Dashboard Cards - Active Salespeople Count
**Requirement**: Display count of users with status = Active

**Steps**:
1. Go to Employees tab
2. Note status of your 3 employees (should all be "Active")
3. Go to Dashboard, check "Active Salespeople" card
4. **Expected**: Card should show 3 (or correct number of active employees)
5. Edit one employee and change status to "Inactive"
6. Go back to Dashboard
7. **Expected**: Card should now show 2
8. **Status**: ✅ PASS if count matches active employees only

**Evidence**: Screenshot showing active count equals active employees

---

### TEST 1.4: Dashboard Cards - Conversion Rate
**Requirement**: Display (Closed Leads / Assigned Leads) * 100

**Steps**:
1. Check Dashboard "Conversion Rate" card
2. Create 20 leads and assign them
3. Update status of 5 leads to "Closed"
4. **Expected**: Conversion Rate = (5/20)*100 = 25%
5. **Status**: ✅ PASS if formula is correct

**Verification Formula**: 
- Closed Leads = 5
- Assigned Leads = 20  
- Expected Conversion = 25%

**Evidence**: Screenshot of card

---

### TEST 1.5: Sales Analytics Graph
**Requirement**: Display conversion rate for past 2 weeks, X-axis = Days, Y-axis = Conversion %

**Steps**:
1. Go to "Sale Analytics" graph section
2. Verify:
   - ✅ X-axis labels: Days (Mon, Tue, Wed, etc.)
   - ✅ Y-axis labels: Percentage (0%, 25%, 50%, 75%, 100%)
   - ✅ Data range: Shows past 14 days
   - ✅ Bars display relative conversion rates
3. Create leads for each day of past week
4. Assign and close different % on each day
5. **Expected**: Graph should update with different bar heights
6. **Status**: ✅ PASS if graph displays correctly and updates

**Evidence**: Screenshot of graph section

---

### TEST 1.6: Recent Activity Feed
**Requirement**: Display last 7 activities with scrolling

**Steps**:
1. Go to "Recent Activity" section on Dashboard
2. Verify:
   - ✅ Shows activities (lead created, assigned, etc.)
   - ✅ Time displayed (e.g., "2 hours ago", "just now")
   - ✅ Activity icons color-coded
   - ✅ Fixed height container (scrolls if >7 items)
3. Create 10 leads
4. Assign leads to employees
5. Update some lead statuses
6. **Expected**: Activity feed should show these actions with timestamps
7. Scroll in activity container
8. **Expected**: Scrollbar visible, can scroll to see older activities
9. **Status**: ✅ PASS if all activities logged and scrollable

**Evidence**: Screenshot of activity feed section

---

### TEST 1.7: Active Sales People List
**Requirement**: Display name, employee ID, assigned/closed leads, status

**Steps**:
1. Go to "Sales Team Performance" section on Dashboard
2. Verify table has columns:
   - ✅ Name (firstName lastName)
   - ✅ Employee ID (8-char unique ID)
   - ✅ Assigned Leads (counter)
   - ✅ Closed Leads (counter)
   - ✅ Status (Active/Inactive indicator)
3. Create 3 employees as before
4. Assign leads: 5 to Employee1, 3 to Employee2, 2 to Employee3
5. Close leads: 2 for Emp1, 1 for Emp2, 0 for Emp3
6. **Expected**: Table shows:
   - Employee1: Assigned=5, Closed=2
   - Employee2: Assigned=3, Closed=1
   - Employee3: Assigned=2, Closed=0
   - All status = "Active" (green badge)
7. **Status**: ✅ PASS if all fields display correctly

**Evidence**: Screenshot of employee table

---

## TEST SUITE 2: EMPLOYEES MODULE

### TEST 2.1: Employee List View
**Requirement**: Each row has checkbox, name, ID, assigned/closed leads, status, 3-dot menu

**Steps**:
1. Go to Employees tab
2. Verify each row contains:
   - ✅ Checkbox (left side)
   - ✅ Name (firstName lastName)
   - ✅ Employee ID (formatted: EMP-{timestamp}-{uuid})
   - ✅ Assigned Leads (number)
   - ✅ Closed Leads (number)
   - ✅ Status (Active/Inactive badge)
   - ✅ 3-dot menu (⋯ icon)
3. Click 3-dot menu
4. **Expected**: Shows "Edit" and "Delete" options
5. **Status**: ✅ PASS if all fields visible and menu works

**Evidence**: Screenshot of employee table

---

### TEST 2.2: Pagination - Page Size 8
**Requirement**: Display 8 employees per page

**Steps**:
1. Create 20 employees (or use bulk data)
2. Go to Employees tab
3. **Expected**: 
   - Page 1 shows employees 1-8
   - Pagination shows pages: 1, 2, 3
4. Count rows on first page
5. **Expected**: Exactly 8 rows visible
6. Click Page 2
7. **Expected**: Employees 9-16 displayed (8 per page)
8. Click Page 3
9. **Expected**: Employees 17-20 displayed (4 employees)
10. **Status**: ✅ PASS if pagination shows 8 per page correctly

**Evidence**: Screenshot of pagination controls

---

### TEST 2.3: Pagination - Navigation Buttons
**Requirement**: Previous/Next buttons, numbered pages

**Steps**:
1. On Employee list with 20+ employees
2. Verify controls:
   - ✅ "Previous" button visible and DISABLED on page 1
   - ✅ "Next" button visible and ENABLED on page 1
   - ✅ Numbered pages: 1, 2, 3, ... (smart pagination)
3. Click "Next"
4. **Expected**: Goes to page 2, Previous now ENABLED
5. Click numbered page "3"
6. **Expected**: Goes directly to page 3
7. On last page, verify "Next" is DISABLED
8. **Status**: ✅ PASS if all navigation works

**Evidence**: Screenshots of different pages

---

### TEST 2.4: Employee Creation Rules
**Requirement**: Only admin can create, appears at top, password = email

**Steps**:
1. Go to Employees > Add Employee
2. Fill form:
   - Name: John Doe
   - Email: john.doe@test.com
   - Phone: 9999999999
   - Language: English
3. Submit
4. **Expected**: New employee appears at TOP of list
5. Check that password = email
   - Backend returns: `{ email: "john.doe@test.com", password: "john.doe@test.com" }`
6. Try logging in as employee on SalesClient:
   - URL: http://localhost:5174/login
   - Email: john.doe@test.com
   - Password: john.doe@test.com
7. **Expected**: Employee can login successfully
8. **Status**: ✅ PASS if employee created at top and can login with email/email

**Evidence**: 
- Screenshot showing new employee at top of list
- Screenshot of successful employee login

---

### TEST 2.5: Bulk Delete
**Requirement**: Select multiple employees and delete together

**Steps**:
1. Go to Employees tab
2. Select checkboxes for 3 employees
3. **Expected**: "Delete Selected" button appears with count "3 employee(s) selected"
4. Click "Delete Selected"
5. **Expected**: Confirmation dialog appears
6. Click "OK" to confirm
7. **Expected**: 
   - All 3 employees deleted
   - Checkboxes cleared
   - List updated
8. Count remaining employees
9. **Expected**: 3 fewer than before
10. **Status**: ✅ PASS if all selected employees deleted

**Evidence**: Screenshot showing:
- Selection with "Delete Selected" button
- Confirmation dialog
- Updated list after deletion

---

## TEST SUITE 3: LEADS MANAGEMENT

### TEST 3.1: CSV File Upload Structure
**Requirement**: CSV has columns: Name, Email, Source, Date, Location, Language

**Steps**:
1. Create sample CSV file with columns:
   ```
   Name,Email,Source,Date,Location,Language
   Raj Kumar,raj@test.com,Website,2025-12-30,Mumbai,English
   Priya Singh,priya@test.com,Referral,2025-12-30,Delhi,Hindi
   Amit Patel,amit@test.com,Email,2025-12-30,Bangalore,Marathi
   ```
2. Go to Leads > Add CSV
3. Upload file
4. **Expected**: File accepted, processing starts
5. **Status**: ✅ PASS if CSV uploads successfully

**Evidence**: Screenshot of upload success message

---

### TEST 3.2: CSV Processing - Validation & Auto-Assignment
**Requirement**: Parse, validate, assign based on language

**Steps**:
1. Upload CSV with:
   - 5 leads with Language=English
   - 3 leads with Language=Hindi
2. Have 2 English employees and 1 Hindi employee
3. After upload completes
4. Go to Leads list
5. **Expected**: 
   - All 8 leads created
   - 5 assigned to English employees (distributed: 3+2 or 2+3)
   - 3 assigned to Hindi employee
6. Check employee counters:
   - Emp1 (English): 3 leads
   - Emp2 (English): 2 leads  
   - Emp3 (Hindi): 3 leads
7. **Status**: ✅ PASS if all leads created and assigned correctly

**Evidence**: Screenshot of leads list showing assignments

---

### TEST 3.3: Lead Assignment - 3-Lead Threshold
**Requirement**: Max 3 leads per employee, then distribute to next employee

**Steps**:
1. Create 3 employees: A, B, C (all English)
2. Create 10 leads all with Language=English
3. Expected assignment:
   - Emp A: Lead 1, 2, 3 (threshold reached)
   - Emp B: Lead 4, 5, 6 (threshold reached)
   - Emp C: Lead 7, 8, 9 (threshold reached)
   - Lead 10: Assign to employee with least (any of A/B/C has 3, so pick first available)
4. **Expected**: No employee has >3 leads initially
5. Create 11th lead
6. **Expected**: Goes to employee with least (now all have 3, so round-robin picks one)
7. **Status**: ✅ PASS if threshold of 3 is enforced

**Evidence**: 
- Screenshot of leads list showing assignment counts
- Verify each employee has ≤3 leads after initial round

---

### TEST 3.4: Lead Assignment - Language Matching
**Requirement**: Exact language match → English fallback → Any employee

**Steps**:

**Scenario A: Exact Match**
1. Create 3 employees: 1 English, 1 Hindi, 1 Marathi
2. Create lead with Language=Hindi
3. **Expected**: Lead assigned to Hindi employee
4. ✅ PASS

**Scenario B: Fallback to English**
1. Create 2 employees: 1 English, 1 Hindi (no Marathi employee)
2. Create lead with Language=Marathi
3. **Expected**: Lead assigned to English employee (fallback)
4. ✅ PASS

**Scenario C: Any Employee**
1. Create 1 employee: English only (no Hindi or Marathi)
2. Create lead with Language=Marathi (and no English, Hindi options)
3. **Expected**: Lead assigned to English employee (only available)
4. ✅ PASS

**Evidence**: Screenshot of lead assignments matching language rules

---

### TEST 3.5: Manual Lead Creation (Single)
**Requirement**: Admin add single lead with form, auto-assign

**Steps**:
1. Go to Leads > Add Manually
2. Fill form:
   - Name: Test Lead
   - Email: testlead@test.com
   - Source: Website
   - Date: Today
   - Location: Mumbai
   - Language: Hindi
3. Submit
4. **Expected**:
   - Lead created in list
   - Auto-assigned to Hindi speaker
   - Status = "Ongoing"
   - Counter incremented for assigned employee
5. **Status**: ✅ PASS if lead created and auto-assigned

**Evidence**: Screenshot showing new lead in list with assignment

---

### TEST 3.6: User Lead Updates - Type
**Requirement**: Sales user can update Type (Hot, Warm, Cold)

**Steps**:
1. As Admin: Create and assign 2 leads
2. Switch to SalesClient (http://localhost:5174)
3. Login as Employee (email/email)
4. Go to Leads section
5. Click on a lead's type update icon
6. Change type from "Cold" to "Hot"
7. **Expected**: Type updates immediately
8. Refresh page
9. **Expected**: Type persists as "Hot"
10. **Status**: ✅ PASS if type updates and persists

**Evidence**: Screenshots showing:
- Lead type change in SalesClient
- Persistence after refresh

---

### TEST 3.7: User Lead Updates - Scheduled Date
**Requirement**: Sales user can update and schedule follow-ups

**Steps**:
1. As Employee in SalesClient
2. Go to Leads
3. Click schedule date icon on a lead
4. Select date and time (e.g., Tomorrow at 2 PM)
5. **Expected**: Date saved and shown
6. Logout and login again
7. **Expected**: Scheduled date still shows
8. Verify lead status cannot be changed to "Closed" if scheduled
   - In modal, try changing to "Closed" when scheduled date exists
   - **Expected**: Action prevented or warning shown
9. **Status**: ✅ PASS if date updates and persists

**Evidence**: Screenshots of scheduled date in leads

---

## TEST SUITE 4: INTEGRATION TESTS

### TEST 4.1: Employee Counter Management
**Requirement**: Counters increment/decrement correctly

**Steps**:
1. Create Employee: Test Counter
2. Go to Dashboard, note Employee counter = 0
3. Create 5 leads and assign all to this employee
4. **Expected**: Counter = 5
5. Close 2 leads
6. Dashboard shows:
   - Assigned: 5
   - Closed: 2
7. Delete 1 lead
8. **Expected**: Counter = 4
9. Reassign 1 lead to different employee
10. **Expected**: Test Counter = 3
11. **Status**: ✅ PASS if counters are accurate

**Evidence**: Screenshot showing updated counters

---

### TEST 4.2: Activity Logging
**Requirement**: All activities logged with type and timestamp

**Steps**:
1. Create employee → Check activity logged as "Employee created"
2. Create lead → Check "Lead created" activity
3. Assign lead → Check "Lead assigned" activity
4. Update lead status → Check activity logged
5. Go to Activity Feed
6. **Expected**: All actions appear with timestamps
7. **Status**: ✅ PASS if all activities logged

**Evidence**: Screenshot of activity feed

---

### TEST 4.3: Performance - Bulk Import
**Requirement**: Use Promise.all for parallel operations

**Steps**:
1. Create CSV with 500 leads
2. Upload to system
3. Measure time to completion
4. **Expected**: Should complete in <30 seconds (parallel insertion)
5. Check database: All 500 leads created
6. Check employee counters: Updated correctly
7. **Status**: ✅ PASS if bulk import completes reasonably fast

**Evidence**: 
- Screenshot of upload completion
- Database verification (count leads)

---

## TEST SUITE 5: DATA INTEGRITY

### TEST 5.1: MongoDB Indexes
**Requirement**: Indexes exist on language, assignedTo, status, compound

**Steps**:
1. Open MongoDB compass or terminal
2. Connect to database
3. Go to collection: leads
4. Check Indexes:
   - ✅ language_1
   - ✅ assignedTo_1
   - ✅ status_1
   - ✅ language_1_assignedTo_1 (compound)
4. **Status**: ✅ PASS if all indexes exist

**Evidence**: Screenshot from MongoDB showing indexes

---

### TEST 5.2: Data Validation
**Requirement**: Required fields enforced

**Steps**:
1. Try creating lead without Name
   - **Expected**: Error message
2. Try creating employee without Email
   - **Expected**: Error message
3. Try CSV with missing columns
   - **Expected**: Validation error before upload
4. **Status**: ✅ PASS if validation works

**Evidence**: Screenshots of validation errors

---

## TEST SUITE 6: AUTHORIZATION & SECURITY

### TEST 6.1: Admin-Only Operations
**Requirement**: Only admin can create/edit/delete employees and leads

**Steps**:
1. Login as Employee (SalesClient)
2. Try accessing `/admin/employees` URL directly
   - **Expected**: Redirected to login or access denied
3. Try accessing employee creation API:
   ```
   POST /api/employees with employee data
   ```
   - **Expected**: 403 Forbidden error
4. **Status**: ✅ PASS if admin routes protected

**Evidence**: Screenshot of access denied

---

### TEST 6.2: Role-Based Access
**Requirement**: Employee can only view assigned leads

**Steps**:
1. Create 10 leads:
   - 5 assigned to Employee A
   - 5 assigned to Employee B
2. Login as Employee A (SalesClient)
3. Go to Leads
4. **Expected**: Only 5 leads visible (assigned to Employee A)
5. Login as Employee B
6. **Expected**: Only 5 different leads visible
7. **Status**: ✅ PASS if employees see only their leads

**Evidence**: Screenshots showing different lead lists for each employee

---

## SUMMARY CHECKLIST

After completing all tests, verify:

### Dashboard (8 tests)
- [ ] Unassigned leads counter correct
- [ ] Assigned this week counter correct
- [ ] Active salespeople counter correct
- [ ] Conversion rate formula correct
- [ ] Sales graph displays 2-week data
- [ ] Activity feed shows 7 items with scrolling
- [ ] Employee table displays all fields
- [ ] Status indicators show Active/Inactive

### Employees (5 tests)
- [ ] Employee list shows all required fields
- [ ] Pagination: 8 per page
- [ ] Pagination navigation works (previous/next/numbered)
- [ ] New employees created at top of list
- [ ] Bulk delete works with confirmation
- [ ] Password = email for new employees
- [ ] Employee can login with email/email

### Leads (7 tests)
- [ ] CSV uploads with correct columns
- [ ] Leads auto-assigned by language
- [ ] 3-lead threshold enforced
- [ ] Round-robin distribution works
- [ ] Manual lead creation works
- [ ] Employee can update lead type
- [ ] Employee can schedule follow-up date

### Integration (3 tests)
- [ ] Employee counters update correctly
- [ ] All activities logged with timestamps
- [ ] Bulk import completes successfully

### Data Integrity (2 tests)
- [ ] MongoDB indexes exist
- [ ] Form validation works

### Security (2 tests)
- [ ] Admin-only routes protected
- [ ] Employees see only their leads

---

## FINAL STATUS

**Total Tests**: 27 core tests  
**Pass Criteria**: All tests ✅ PASS

**When All Tests Pass**: ✅ SRD IS 100% COMPLIANT

---

**Testing Completed By**: ___________________  
**Date**: ___________________  
**Status**: [ ] PASS [ ] FAIL  
**Notes**: ________________________________________________
