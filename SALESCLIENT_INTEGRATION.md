# SalesClient Integration Guide

## Overview
SalesClient is the employee-facing frontend application for the CanovaCRM system. It allows employees to:
- Login with credentials provided by admin
- View assigned leads
- Update lead status and schedule follow-ups
- Track attendance (check-in/check-out)
- Manage their profile
- View statistics and activity

## Setup Instructions

### Prerequisites
- Node.js v18+ installed
- Backend server running on http://localhost:5000
- MongoDB instance connected to backend

### Installation

1. Navigate to salesClient directory:
```bash
cd /home/akka/CanovaCRM/salesClient
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will be available at `http://localhost:5173`

## Authentication Flow

### Employee Login
1. Admin creates an employee with email and preferred language
2. Backend automatically creates a User account with:
   - Email: [employee email]
   - Password: [employee email]
   - Role: 'employee'
3. Employee logs in using these credentials
4. JWT token is stored in localStorage
5. Token is automatically included in all API requests

### Logout
- Clicking logout removes token from localStorage
- Redirects to login page
- All protected routes become inaccessible

## Features

### 1. Dashboard (Home Page)
**Route:** `/`
**Components:** Home.jsx

**Features:**
- Display employee name and greeting (Good Morning/Afternoon/Evening)
- Show assigned leads statistics:
  - Total leads assigned
  - Ongoing leads
  - Closed deals
- Display check-in/check-out times
- Show break history
- Recent activity summary

**Data Source:**
- Fetches leads from `/api/leads` (with `assignedToMe=true`)
- Displays employee data from Redux auth store

### 2. Leads Management
**Route:** `/leads`
**Components:** Leads.jsx

**Features:**
- List all assigned leads with search/filter
- Display lead information:
  - Name
  - Email
  - Phone
  - Status (Ongoing/Closed/New)
  - Scheduled date
- Update lead status
- Schedule follow-up dates
- Edit lead type
- Color-coded status indicators

**Actions:**
- Click on lead to view details
- Use icons to:
  - Edit type (pencil icon)
  - Schedule date (calendar icon)
  - Change status (dropdown icon)

### 3. Profile Management
**Route:** `/profile`
**Components:** Profile.jsx

**Features:**
- Update first and last name
- Change password
- Logout

**Data Validation:**
- Password minimum 6 characters
- Password confirmation required
- Email cannot be changed
- All updates persist to backend

### 4. Schedule (To be implemented)
**Route:** `/shedule`
**Components:** Shedule.jsx (note: typo in original)

**Planned Features:**
- View scheduled follow-ups
- Create new schedules
- Edit existing schedules
- Delete schedules

### 5. Attendance (To be implemented)
**Backend Routes:** `/api/attendance`

**Endpoints:**
- `GET /today` - Get today's attendance record
- `POST /check-in` - Mark check-in
- `POST /check-out` - Mark check-out
- `POST /break/start` - Start break
- `POST /break/end` - End break
- `GET /history` - Get attendance history by month

## API Integration

### Axios Instance
**File:** `src/api/axiosInstance.js`

Features:
- Automatic JWT token injection in request headers
- Base URL: `http://localhost:5000/api`
- Automatic token refresh on 401 errors
- Redirects to login on authentication failure

### API Modules
**File:** `src/api/api.js`

Available endpoints:
```javascript
// Authentication
authAPI.login(credentials)
authAPI.getCurrentUser()
authAPI.updateProfile(data)

// Leads
leadAPI.getMyLeads(page, limit)
leadAPI.getLeadById(id)
leadAPI.updateLead(id, data)

// Attendance
attendanceAPI.checkIn()
attendanceAPI.checkOut()
attendanceAPI.startBreak()
attendanceAPI.endBreak()
attendanceAPI.getMyAttendance(date)
attendanceAPI.getBreakLogs(date)

// Activity
activityAPI.getRecentActivity(limit)

// Schedule
scheduleAPI.getMySchedules()
scheduleAPI.createSchedule(data)
scheduleAPI.updateSchedule(id, data)
scheduleAPI.deleteSchedule(id)
```

## Redux State Management

### Slices

#### authSlice
**File:** `src/redux/authSlice.js`

State:
```javascript
{
  user: { id, email, firstName, lastName, role },
  token: string,
  isAuthenticated: boolean,
  loading: boolean,
  error: null | string
}
```

Actions:
- `login(credentials)` - Authenticate employee
- `getCurrentUser()` - Fetch current user info
- `updateProfile(data)` - Update profile
- `logout()` - Clear auth and redirect

#### leadsSlice
**File:** `src/redux/leadsSlice.js`

State:
```javascript
{
  leads: Array,
  currentLead: null | Object,
  totalLeads: number,
  currentPage: number,
  totalPages: number,
  loading: boolean,
  error: null | string
}
```

Actions:
- `fetchMyLeads({ page, limit })` - Get assigned leads
- `fetchLeadById(id)` - Get single lead details
- `updateLead({ id, data })` - Update lead

### Store
**File:** `src/redux/store.js`

Configured with:
- Redux Toolkit configureStore
- authReducer
- leadsReducer
- Serialization check disabled for Date objects

## Protected Routes

Using `PrivateRoute` component:
```javascript
<PrivateRoute>
  <Home />
</PrivateRoute>
```

Features:
- Checks Redux `isAuthenticated` state
- Redirects to `/login` if not authenticated
- Persists authentication across page refresh (token from localStorage)

## Authentication Guards

**File:** `src/components/PrivateRoute.jsx`

- All protected routes are wrapped with PrivateRoute
- Navbar only displays on non-login pages
- Login page accessible to unauthenticated users only

## Testing the Integration

### 1. Admin Creation & Employee Setup
```bash
# In admin client
1. Navigate to Employees
2. Add new employee:
   - Name: Test Employee
   - Email: employee@test.com
   - Preferred Language: English
   - Phone: 9999999999
3. Note the password (email by default)
```

### 2. Employee Login
```
1. Navigate to localhost:5173/login
2. Enter credentials:
   - Email: employee@test.com
   - Password: employee@test.com
3. Should redirect to home page
4. Should see employee name in header
```

### 3. View Assigned Leads
```
1. On home page, verify:
   - Total leads count
   - Ongoing count
   - Closed count
2. Navigate to /leads
3. Verify all assigned leads are displayed
4. Search/filter should work
```

### 4. Update Lead Status
```
1. On leads page, click status dropdown
2. Change from "Ongoing" to "Closed"
3. Should update immediately
4. Home page stats should reflect change
```

### 5. Profile Management
```
1. Navigate to /profile
2. Update first/last name
3. Click Save
4. Should show success message
5. Logout and login again to verify persistence
```

## Environment Variables

Currently hardcoded in axiosInstance.js:
```javascript
baseURL: 'http://localhost:5000/api'
```

To make it configurable:
1. Create `.env` file in salesClient root
2. Add: `VITE_API_URL=http://localhost:5000/api`
3. Update axiosInstance.js to use `import.meta.env.VITE_API_URL`

## Known Issues & TODOs

### Completed ✅
- [x] Login with JWT authentication
- [x] Fetch and display assigned leads
- [x] Update lead status
- [x] Schedule follow-ups
- [x] Profile management
- [x] Logout functionality
- [x] Authentication guards on routes
- [x] Redux state management
- [x] API integration with backend

### In Progress 🔄
- [ ] Attendance check-in/check-out UI
- [ ] Schedule management UI
- [ ] Activity feed real-time updates

### Pending ⏳
- [ ] Lead details/notes page
- [ ] Call logging/notes
- [ ] Document upload for leads
- [ ] Real-time notifications
- [ ] Offline support

## Project Structure
```
salesClient/
├── src/
│   ├── api/
│   │   ├── axiosInstance.js      # Axios config with JWT
│   │   └── api.js                # API endpoint definitions
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx         # Login form with Redux
│   │   │   └── Login.css
│   │   ├── Main/
│   │   │   ├── Home/
│   │   │   ├── Leads/
│   │   │   ├── Profile/
│   │   │   └── Shedule/
│   │   ├── PrivateRoute.jsx      # Route protection
│   │   └── Bottombar/
│   │       └── Navbar.jsx
│   ├── redux/
│   │   ├── authSlice.js          # Auth state
│   │   ├── leadsSlice.js         # Leads state
│   │   └── store.js              # Redux store config
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point with Redux provider
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

## Performance Optimizations

1. **Memoization:** useSelector to prevent unnecessary re-renders
2. **Code Splitting:** React Router lazy loading can be added
3. **API Caching:** Redux stores data in state
4. **Pagination:** Leads list supports pagination (not fully implemented)

## Security Notes

1. ✅ JWT token stored in localStorage
2. ✅ Token automatically included in requests
3. ✅ Token cleared on logout
4. ✅ Protected routes with authentication check
5. ⚠️ TODO: Consider httpOnly cookies for token storage
6. ⚠️ TODO: Implement token refresh mechanism

## Troubleshooting

### "Not authenticated" error after login
- Check browser localStorage for 'token' key
- Verify backend is running on port 5000
- Check Network tab for 401 responses

### Leads not loading
- Verify employee has assigned leads from admin
- Check Redux devtools to see fetchMyLeads status
- Check backend `/api/leads` endpoint

### Profile update fails
- Verify all required fields are filled
- Check password validation (min 6 chars)
- Verify backend authController has updateProfile endpoint

## Backend Requirements

Ensure the following endpoints exist in the backend:

```
POST   /api/auth/login              - Employee login
GET    /api/auth/current-user       - Get current user
PUT    /api/auth/profile            - Update profile

GET    /api/leads?assignedToMe=true - Get assigned leads
GET    /api/leads/:id               - Get lead details
PUT    /api/leads/:id               - Update lead

POST   /api/attendance/check-in     - Check in
POST   /api/attendance/check-out    - Check out
POST   /api/attendance/break/start  - Start break
POST   /api/attendance/break/end    - End break
GET    /api/attendance/today        - Get today's attendance
GET    /api/attendance/history      - Get attendance history
```

## Contributing

When adding new features:
1. Create API function in `src/api/api.js`
2. Create async thunks in corresponding Redux slice
3. Use useSelector to access state
4. Use useDispatch to trigger actions
5. Handle loading and error states

## Support

For issues or questions, check:
1. Backend logs for API errors
2. Browser console for frontend errors
3. Redux devtools for state issues
4. Network tab for HTTP errors
