import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Login from './components/Auth/Login'
import Navbar from './components/Bottombar/Navbar'
import PrivateRoute from './components/PrivateRoute'

// Import the other components
import Home from './components/Main/Home/Home'
import Lead from './components/Main/Leads/Leads'
import Schedule from './components/Main/Shedule/Shedule'
import Profile from './components/Main/Profile/Profile'

// Wrapper component to conditionally render Navbar
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/leads" element={<PrivateRoute><Lead /></PrivateRoute>} />
        <Route path="/shedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
      {!isLoginPage && (
        <div className="navbar-container">
          <Navbar />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
