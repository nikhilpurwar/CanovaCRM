import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Navbar from './components/Bottombar/Navbar'

// Import the other components
import Home from './components/Main/Home/Home'
import Lead from './components/Main/Leads/Leads'
import Schedule from './components/Main/Shedule/Shedule'
import Profile from './components/Main/Profile/Profile'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/leads" element={<Lead />} />
          <Route path="/shedule" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <div className="navbar-container">
          <Navbar />
        </div>
      </Router>
    </>
  )
}

export default App
