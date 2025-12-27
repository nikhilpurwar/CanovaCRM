import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import Dashboard from './components/Main/Dashboard/Dashboard.jsx'
import Employee from './components/Main/Employees/Employees.jsx'
import Leads from './components/Main/Leads/Leads.jsx'
import Settings from './components/Main/Settings/Settings.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <div className='sidebar-container'>
          <Sidebar />
        </div>
        <main className='main-container'>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leads" element={<Leads />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
