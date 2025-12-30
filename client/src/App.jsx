import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import Dashboard from './components/Main/Dashboard/Dashboard.jsx'
import Employee from './components/Main/Employees/Employees.jsx'
import Leads from './components/Main/Leads/Leads.jsx'
import Settings from './components/Main/Settings/Settings.jsx'
import Login from './components/Auth/Login.jsx'
import SignUp from './components/Auth/SignUp.jsx'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { user } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="App">
        {user && <div className='sidebar-container'><Sidebar /></div>}
        <main className={user ? 'main-container' : ''}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
