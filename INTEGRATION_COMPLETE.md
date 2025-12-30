# CanovaCRM - Integration Summary

**Date**: December 30, 2025  
**Status**: ✅ Complete Integration

## What Has Been Set Up

### 1. **Backend Server** (Port 5000)
- ✅ Express.js API server
- ✅ MongoDB database connection
- ✅ Authentication (JWT with roles: admin, employee)
- ✅ Employee management with automatic User account creation
- ✅ Lead management with intelligent assignment
- ✅ Attendance tracking (check-in, check-out, breaks)
- ✅ CORS configured for both frontends (5173 and 5174)

**Key Files:**
- `server/src/index.js` - CORS configured for both ports
- `server/src/routes/` - All API endpoints
- `server/src/models/` - Database schemas

---

### 2. **Admin Client** (Port 5173)
- ✅ React + Vite frontend
- ✅ Redux Toolkit state management
- ✅ Admin authentication (login/register with secret key)
- ✅ Employee management (CRUD operations)
- ✅ Lead management (create, bulk upload, assign)
- ✅ Dashboard with analytics
- ✅ CSV bulk upload functionality
- ✅ API integration with axiosInstance

**Key Features:**
- Admin-only system (one admin account per deployment)
- Automatic User account creation for employees
- Intelligent lead assignment based on language and availability
- Comprehensive admin dashboard

**Access**: http://localhost:5173

---

### 3. **SalesClient** (Port 5174)
- ✅ React + Vite frontend (separate from admin)
- ✅ Redux Toolkit state management
- ✅ Employee authentication (login with auto-created credentials)
- ✅ View assigned leads only
- ✅ Update lead status and schedule follow-ups
- ✅ Profile management (update name, password)
- ✅ Dashboard with personal statistics
- ✅ Authentication guards on protected routes
- ✅ API integration with axiosInstance

**Key Features:**
- Employee login with email/email credentials
- View only assigned leads
- Update lead status in real-time
- Track personal statistics (total, ongoing, closed)
- Secure logout

**Access**: http://localhost:5174

---

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| **Backend** | 5000 | http://localhost:5000 |
| **Admin Frontend** | 5173 | http://localhost:5173 |
| **Employee Frontend** | 5174 | http://localhost:5174 |

**Vite Configuration:**
- `client/vite.config.js` → Port 5173
- `salesClient/vite.config.js` → Port 5174

**CORS Configuration:**
- Backend allows requests from both 5173 and 5174
- Updated in `server/src/index.js`

---

## API Integration

### Both Frontends Use

**Axios Instance** with:
- ✅ Base URL: `http://localhost:5000/api`
- ✅ Automatic JWT token injection
- ✅ Error handling and 401 redirect to login
- ✅ CORS-enabled requests

### Admin Client (`client/src/api/axiosInstance.js`)
```javascript
baseURL: 'http://localhost:5000/api'
```

### SalesClient (`salesClient/src/api/axiosInstance.js`)
```javascript
baseURL: 'http://localhost:5000/api'
```

---

## How Everything Connects

```
┌─────────────────────────────────┐
│   Admin Client (5173)           │
│  - Create Employees             │
│  - Create Leads                 │
│  - Assign Leads                 │
│  - View Dashboard               │
└────────────┬────────────────────┘
             │
             │ API Calls
             │ (axiosInstance)
             ↓
      ┌──────────────┐
      │ Backend (5000)
      │  - JWT Auth
      │  - Lead Logic
      │  - Assignment
      │  - User Mgmt
      └──────────────┘
             ↑
             │ API Calls
             │ (axiosInstance)
             │
┌────────────┴────────────────────┐
│   Employee Client (5174)        │
│  - Login with credentials       │
│  - View Assigned Leads          │
│  - Update Lead Status           │
│  - Manage Profile               │
└─────────────────────────────────┘
```

---

## Complete User Flow

### Admin Setup

1. **Start Backend**
   ```bash
   cd /home/akka/CanovaCRM/server
   npm start
   ```

2. **Start Admin Client**
   ```bash
   cd /home/akka/CanovaCRM/client
   npm run dev
   ```

3. **Open Admin**: http://localhost:5173

4. **Register Admin**
   - Click "Register as Admin"
   - Fill form with name, email, password
   - Enter Admin Secret Key: `admin123` (from .env)
   - Click Register

5. **Login as Admin**
   - Use registered credentials
   - Access admin dashboard

### Employee Workflow

6. **Create Employee** (from Admin)
   - Navigate to Employees section
   - Click "Add Employee"
   - Fill: Name, Email, Phone, Language
   - Click Save
   - ✅ User account auto-created with email/email credentials

7. **Create Leads** (from Admin)
   - Upload CSV or add manually
   - Leads auto-assigned based on language & availability

8. **Start Employee Client**
   ```bash
   cd /home/akka/CanovaCRM/salesClient
   npm run dev
   ```

9. **Open Employee Client**: http://localhost:5174

10. **Employee Login**
    - Email: [employee email from step 6]
    - Password: [same as email]
    - Click Submit

11. **Employee Dashboard**
    - ✅ See assigned leads
    - ✅ Update lead status
    - ✅ Schedule follow-ups
    - ✅ Manage profile
    - ✅ View statistics

---

## Key Features Implemented

### ✅ Authentication System
- Admin registration with secret key requirement
- Employee auto-creation with User account
- JWT-based authentication
- Role-based access (admin vs employee)
- Automatic token handling in requests

### ✅ Lead Management
- Create/edit/delete leads
- Bulk CSV upload
- Intelligent assignment algorithm:
  - Language matching (exact → English → any)
  - Round-robin distribution
  - 3-lead threshold per employee
  - Counter updates on assignment

### ✅ Employee Management
- CRUD operations for employees
- Auto User account creation on employee creation
- Auto User account deletion on employee deletion
- Language preference tracking
- Lead counter management

### ✅ Frontend Integration
- Redux state management in both apps
- API calls through axiosInstance
- Protected routes with PrivateRoute component
- Error handling and user feedback
- Persistent authentication (localStorage)

### ✅ UI Components
- Login/Registration forms
- Employee management forms
- Lead list with search/filter
- Status update modals
- Profile management page
- Dashboard with statistics

---

## Environment Files

### Server `.env`
```env
MONGODB_URI=mongodb://localhost:27017/canovaCRM
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=admin123
```

### Admin Client (Optional `.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### SalesClient (Optional `.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Files Modified/Created

### Backend
- ✅ `server/src/index.js` - CORS updated for both ports
- ✅ `server/src/routes/attendanceRoutes.js` - New attendance endpoints
- ✅ `server/src/controllers/attendanceController.js` - Attendance logic
- ✅ `server/src/models/Attendance.js` - Attendance schema

### Admin Client
- ✅ `client/vite.config.js` - Port 5173 configured

### SalesClient
- ✅ `salesClient/vite.config.js` - Port 5174 configured
- ✅ `salesClient/src/api/axiosInstance.js` - API configuration
- ✅ `salesClient/src/api/api.js` - API endpoints
- ✅ `salesClient/src/redux/authSlice.js` - Auth state
- ✅ `salesClient/src/redux/leadsSlice.js` - Leads state
- ✅ `salesClient/src/redux/store.js` - Redux store
- ✅ `salesClient/src/main.jsx` - Redux provider
- ✅ `salesClient/src/App.jsx` - Protected routes
- ✅ `salesClient/src/components/PrivateRoute.jsx` - Route guards
- ✅ `salesClient/src/components/Auth/Login.jsx` - Login with Redux
- ✅ `salesClient/src/components/Main/Home/Home.jsx` - Dashboard
- ✅ `salesClient/src/components/Main/Leads/Leads.jsx` - Leads list
- ✅ `salesClient/src/components/Main/Profile/Profile.jsx` - Profile management

### Documentation
- ✅ `COMPLETE_SETUP_GUIDE.md` - Full setup and troubleshooting
- ✅ `SALESCLIENT_INTEGRATION.md` - SalesClient integration details
- ✅ `start-all.sh` - Quick start script

---

## Troubleshooting Quick Reference

### Ports in Use?
```bash
lsof -i :5000    # Check backend
lsof -i :5173    # Check admin
lsof -i :5174    # Check employee
```

### CORS Errors?
- Verify backend `src/index.js` has both ports
- Restart backend after changes
- Hard refresh browser

### Login Fails?
- Check employee was created in admin
- Verify credentials (password = email by default)
- Check localStorage for token

### Leads Not Loading?
- Create leads in admin client
- Verify admin assigned leads to employee
- Check Redux state in DevTools

---

## Next Steps

1. ✅ **Start all services** (Backend 5000, Admin 5173, Sales 5174)
2. ✅ **Register admin** and login
3. ✅ **Create employees** (auto-creates User accounts)
4. ✅ **Create/import leads** (auto-assigns to employees)
5. ✅ **Login as employee** and view assigned leads
6. ✅ **Test lead status updates** and profile management

---

## Success Indicators

### Backend
- ✅ Running on http://localhost:5000
- ✅ Health check returns `{"message":"Server is running"}`
- ✅ Logs show no errors

### Admin Client
- ✅ Running on http://localhost:5173
- ✅ Can register admin with secret key
- ✅ Can login and see dashboard
- ✅ Can create employees
- ✅ Can create/upload leads

### SalesClient
- ✅ Running on http://localhost:5174
- ✅ Can login with employee credentials
- ✅ Can see assigned leads
- ✅ Can update lead status
- ✅ Can manage profile

---

## System Statistics

| Component | Type | Status |
|-----------|------|--------|
| Backend Server | Node.js/Express | ✅ Ready |
| Database | MongoDB | ✅ Ready |
| Admin Frontend | React/Vite | ✅ Ready |
| Employee Frontend | React/Vite | ✅ Ready |
| API Integration | Axios | ✅ Connected |
| State Management | Redux | ✅ Configured |
| Authentication | JWT | ✅ Implemented |
| CORS | Multi-Origin | ✅ Enabled |

---

## Documentation Links

- **Complete Setup**: [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
- **SalesClient Details**: [SALESCLIENT_INTEGRATION.md](./SALESCLIENT_INTEGRATION.md)
- **Quick Start Script**: [start-all.sh](./start-all.sh)

---

**Status**: ✅ All systems ready for testing!

To get started, follow the "Complete User Flow" section above.
