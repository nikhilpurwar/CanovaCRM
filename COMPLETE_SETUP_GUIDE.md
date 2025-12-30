# CanovaCRM - Complete Setup Guide

## System Overview

CanovaCRM is a complete CRM system with two separate frontends and one backend:

```
┌─────────────────────┐
│  Admin Frontend     │
│  (Client)           │
│  Port: 5173         │
└────────┬────────────┘
         │
         │ API Calls
         │
┌─────────┴────────────┐
│   Backend Server    │
│   (Node.js/Express) │
│   Port: 5000        │
└────────┬────────────┘
         │
         │ API Calls
         │
┌─────────┴────────────┐
│  Employee Frontend  │
│  (SalesClient)      │
│  Port: 5174         │
└─────────────────────┘

   MongoDB Database
     (Backend)
```

## Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Running locally or connection string in .env
- **Git**: For version control
- **Terminal**: Bash/Zsh (or equivalent)

## Directory Structure

```
/home/akka/CanovaCRM/
├── client/                 # Admin Frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js      # Port 5173
│   └── .env (optional)
├── salesClient/            # Employee Frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js      # Port 5174
│   └── .env (optional)
├── server/                 # Backend
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── server.js
└── SALESCLIENT_INTEGRATION.md
```

## Quick Start (All Services)

### 1. Terminal 1 - Backend Server

```bash
cd /home/akka/CanovaCRM/server
npm install  # Only if dependencies not installed
npm start    # or npm run dev for development mode
```

Expected output:
```
Server running on port 5000
Environment: development
```

### 2. Terminal 2 - Admin Frontend

```bash
cd /home/akka/CanovaCRM/client
npm install  # Only if dependencies not installed
npm run dev
```

Expected output:
```
Local:   http://localhost:5173
```

### 3. Terminal 3 - Employee Frontend (SalesClient)

```bash
cd /home/akka/CanovaCRM/salesClient
npm install  # Only if dependencies not installed
npm run dev
```

Expected output:
```
Local:   http://localhost:5174
```

---

## Detailed Setup Instructions

### Step 1: Backend Setup

#### Install Dependencies
```bash
cd /home/akka/CanovaCRM/server
npm install
```

#### Environment Configuration
Create or verify `.env` file in server root:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/canovaCRM

# Port
PORT=5000

# Environment
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Admin Secret Key (for signup)
ADMIN_SECRET_KEY=admin123

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173,http://localhost:5174
```

#### Start Backend
```bash
npm start
```

**Verify**: Open http://localhost:5000/health
- Should return: `{"message":"Server is running"}`

---

### Step 2: Admin Frontend Setup

#### Install Dependencies
```bash
cd /home/akka/CanovaCRM/client
npm install
```

#### Environment Configuration (Optional)
Create `.env` file if you want to override API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Dev Server
```bash
npm run dev
```

**Access**: http://localhost:5173

#### First Time Admin Registration
1. Click "Register as Admin"
2. Fill form with:
   - Name: Your Admin Name
   - Email: admin@example.com
   - Password: securepassword
   - Admin Secret Key: `admin123` (from server .env)
3. Login with these credentials

---

### Step 3: Employee Frontend (SalesClient) Setup

#### Install Dependencies
```bash
cd /home/akka/CanovaCRM/salesClient
npm install
```

#### Environment Configuration (Optional)
Create `.env` file if you want to override API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Dev Server
```bash
npm run dev
```

**Access**: http://localhost:5174

#### Login with Employee Credentials
1. Admin creates employee in admin panel
2. Employee is auto-created with:
   - Email: employee@email.com
   - Password: employee@email.com (same as email by default)
3. Employee logs in at http://localhost:5174/login

---

## API Communication Flow

### Admin Client → Backend
```
Admin Client (5173)
    ↓
axios (axiosInstance.js)
    ↓
http://localhost:5000/api
    ↓
Backend Routes
    ↓
Response back to Admin Client
```

### SalesClient → Backend
```
SalesClient (5174)
    ↓
axios (axiosInstance.js)
    ↓
http://localhost:5000/api
    ↓
Backend Routes
    ↓
Response back to SalesClient
```

### Key Headers
All API requests automatically include:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Testing the Full System

### Test Case 1: Admin Registration & Login

**Admin Client (http://localhost:5173)**
```
1. Open admin client
2. Click "Register as Admin"
3. Enter credentials with Admin Secret Key
4. Login with admin email/password
5. Should see Dashboard
```

### Test Case 2: Create Employee

**Admin Client Dashboard**
```
1. Navigate to Employees
2. Click "Add Employee"
3. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@company.com
   - Phone: 9876543210
   - Preferred Language: English
4. Click Save
5. Should see success message
6. Employee User account auto-created in backend
```

### Test Case 3: Create Leads

**Admin Client**
```
1. Navigate to Leads
2. Click "Add Leads" or Upload CSV
3. Leads auto-assigned to employees based on:
   - Language match (exact → English → any)
   - 3-lead threshold per employee
   - Round-robin distribution
```

### Test Case 4: Employee Login & View Leads

**SalesClient (http://localhost:5174)**
```
1. Open http://localhost:5174/login
2. Enter employee credentials:
   - Email: john.doe@company.com
   - Password: john.doe@company.com
3. Click Submit
4. Should redirect to Home (Dashboard)
5. Should show:
   - Employee name in header
   - Assigned leads count
   - Ongoing/Closed statistics
```

### Test Case 5: Employee Update Lead Status

**SalesClient Leads Page**
```
1. Click on Leads menu
2. View all assigned leads
3. Click status dropdown on a lead
4. Change status from "Ongoing" to "Closed"
5. Should update immediately
6. Home statistics should reflect change
```

### Test Case 6: Employee Profile Update

**SalesClient Profile Page**
```
1. Click Profile menu
2. Update First/Last name
3. (Optional) Change password
4. Click Save
5. Should show success message
6. Logout and login again to verify persistence
```

---

## Troubleshooting

### Issue: Backend fails to start
**Symptoms**: Port 5000 already in use or MongoDB connection error

**Solutions**:
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Verify MongoDB is running
mongosh

# Check backend .env file
cat /home/akka/CanovaCRM/server/.env
```

### Issue: Admin Client shows "Cannot GET /api/..."
**Symptoms**: API calls returning 404

**Solutions**:
1. Verify backend is running on port 5000
2. Check browser Console for error messages
3. Verify CORS is allowed (should show both ports in server/src/index.js)
4. Check axiosInstance.js has correct baseURL

### Issue: SalesClient login fails
**Symptoms**: "Invalid credentials" or blank error

**Solutions**:
1. Verify employee was created in admin client
2. Check employee email and password (default = email)
3. Verify token is stored in localStorage
4. Check browser Network tab for API response

### Issue: Leads not displaying in SalesClient
**Symptoms**: "No leads assigned" message

**Solutions**:
1. Create leads in admin client
2. Verify leads are assigned to logged-in employee
3. Check Redux state in browser DevTools
4. Verify `/api/leads` endpoint is working

### Issue: CORS errors in browser
**Symptoms**: "Cross-Origin Request Blocked"

**Solutions**:
1. Verify backend CORS includes both frontend URLs:
   ```javascript
   origin: ['http://localhost:5173', 'http://localhost:5174']
   ```
2. Restart backend server after CORS changes
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Port already in use
```bash
# Find and kill process on port
lsof -i :5173
kill -9 <PID>

lsof -i :5174
kill -9 <PID>

lsof -i :5000
kill -9 <PID>
```

---

## Development Mode Features

### Admin Client (5173)
- Hot Module Replacement (HMR)
- Redux DevTools integration
- React Dev Tools support
- Automatic refresh on file changes

### SalesClient (5174)
- Hot Module Replacement (HMR)
- Redux DevTools integration
- React Dev Tools support
- Automatic refresh on file changes

### Backend (5000)
- Nodemon watch mode (auto-restart on changes)
- Comprehensive logging
- Error stack traces

---

## Building for Production

### Admin Client
```bash
cd /home/akka/CanovaCRM/client
npm run build
```
Output: `client/dist/`

### SalesClient
```bash
cd /home/akka/CanovaCRM/salesClient
npm run build
```
Output: `salesClient/dist/`

### Backend
Backend is ready for production as-is (Node.js application)

---

## Architecture Details

### Authentication Flow

```
User Login Request
    ↓
Backend validates credentials
    ↓
Returns JWT token + user data
    ↓
Frontend stores token in localStorage
    ↓
All subsequent requests include Authorization header
    ↓
Backend verifies token (authMiddleware)
    ↓
Route handler executes
    ↓
Response sent back to frontend
```

### Data Flow for Leads

```
Admin creates/imports leads
    ↓
Backend assignLeadToEmployee() function
    ↓
Finds matching employee by language
    ↓
Checks 3-lead threshold
    ↓
Assigns to employee with least leads
    ↓
Employee sees leads in SalesClient
    ↓
Employee updates lead status
    ↓
Backend updates lead + employee counters
    ↓
SalesClient shows updated statistics
```

---

## Ports Summary

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Admin Client | 5173 | http://localhost:5173 |
| SalesClient | 5174 | http://localhost:5174 |
| API Base URL | 5000 | http://localhost:5000/api |

---

## Important Files

### Backend
- `.env` - Environment variables and secrets
- `src/index.js` - Main server entry point (CORS config)
- `src/routes/` - API route definitions
- `src/controllers/` - Business logic
- `src/models/` - Database schemas

### Admin Client
- `src/api/axiosInstance.js` - API communication
- `src/redux/` - State management (Redux store)
- `vite.config.js` - Vite configuration (port 5173)

### SalesClient
- `src/api/axiosInstance.js` - API communication
- `src/redux/` - State management
- `vite.config.js` - Vite configuration (port 5174)

---

## Next Steps

1. **Start all three services** in separate terminals
2. **Create admin account** in admin client (5173)
3. **Create employees** in admin client
4. **Create/import leads** in admin client
5. **Login as employee** in sales client (5174)
6. **Test lead management** and status updates

---

## Support & Documentation

- **Admin Client Guide**: See `client/README.md`
- **SalesClient Guide**: See [SALESCLIENT_INTEGRATION.md](./SALESCLIENT_INTEGRATION.md)
- **Backend API**: Check `server/README.md` or code comments
- **Troubleshooting**: See "Troubleshooting" section above

---

## Useful Commands

```bash
# Install all dependencies at once
npm install && cd ../salesClient && npm install && cd ../server && npm install

# Start everything in one command (requires tmux/screen)
tmux new-session -d -s canova "cd /home/akka/CanovaCRM/server && npm start" \
  && tmux new-window -t canova "cd /home/akka/CanovaCRM/client && npm run dev" \
  && tmux new-window -t canova "cd /home/akka/CanovaCRM/salesClient && npm run dev"

# Check all ports are listening
lsof -i :5000 && lsof -i :5173 && lsof -i :5174

# Stop all Node processes
pkill node

# View server logs
tail -f /home/akka/CanovaCRM/server/.env
```

---

**Last Updated**: December 30, 2025
**Version**: 1.0
