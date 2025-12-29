import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './dashboard.css'

import Cards from './component/Cards/Cards'
import Graph from './component/Sales Analytic Graph/SalesAnalyticGraph'
import Feed from './component/Activty Feed/ActivityFeedCard'
import EmployeeTable from './component/Employee Table/EmployeeTable';
import { getDashboardStats, getRecentActivities } from "../../../redux/slices/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, activities, loading, error } = useSelector(state => state.dashboard);
  const { employees } = useSelector(state => state.employees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    // Dispatch thunks but don't wait for them
    dispatch(getDashboardStats()).catch(err => console.log('Dashboard stats error:', err));
    dispatch(getRecentActivities(7)).catch(err => console.log('Activities error:', err));
    
    // Show data after 1 second timeout
    const timer = setTimeout(() => {
      setShowData(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Real-time case-insensitive team member search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees([]);
    } else {
      const filtered = employees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  return (
    <div className="employee">
      <nav className='navbar'>
        <div className="search-bar">
          <div className="search-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.1333 24L13.7333 15.6C13.0667 16.1333 12.3 16.5556 11.4333 16.8667C10.5667 17.1778 9.64445 17.3333 8.66667 17.3333C6.24444 17.3333 4.19444 16.4944 2.51667 14.8167C0.838889 13.1389 0 11.0889 0 8.66667C0 6.24444 0.838889 4.19444 2.51667 2.51667C4.19444 0.838889 6.24444 0 8.66667 0C11.0889 0 13.1389 0.838889 14.8167 2.51667C16.4944 4.19444 17.3333 6.24444 17.3333 8.66667C17.3333 9.64445 17.1778 10.5667 16.8667 11.4333C16.5556 12.3 16.1333 13.0667 15.6 13.7333L24 22.1333L22.1333 24ZM8.66667 14.6667C10.3333 14.6667 11.75 14.0833 12.9167 12.9167C14.0833 11.75 14.6667 10.3333 14.6667 8.66667C14.6667 7 14.0833 5.58333 12.9167 4.41667C11.75 3.25 10.3333 2.66667 8.66667 2.66667C7 2.66667 5.58333 3.25 4.41667 4.41667C3.25 5.58333 2.66667 7 2.66667 8.66667C2.66667 10.3333 3.25 11.75 4.41667 12.9167C5.58333 14.0833 7 14.6667 8.66667 14.6667Z" fill="#636060" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && filteredEmployees.length > 0 && (
            <div className="search-dropdown">
              {filteredEmployees.slice(0, 5).map(emp => (
                <div key={emp._id} className="search-item">
                  <div className="search-item-avatar">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div className="search-item-info">
                    <div className="search-item-name">{emp.firstName} {emp.lastName}</div>
                    <div className="search-item-email">{emp.email}</div>
                  </div>
                </div>
              ))}
              {filteredEmployees.length > 5 && (
                <div className="search-item-more">
                  +{filteredEmployees.length - 5} more results
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="employeeContainer">
        <div className="navPath">
          <div>
            <Link>Home </Link>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.64167 4.75L0 1.10833L1.10833 0L5.85833 4.75L1.10833 9.5L0 8.39167L3.64167 4.75Z" fill="#979797" />
            </svg>
            <Link> Dashboard</Link>
          </div>
        </div>
      </div>

      {loading && !showData ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', color: '#666' }}>Loading dashboard...</div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>Setting up your analytics</div>
        </div>
      ) : (
        <div className='dashboard_container'>
          <div className="dashboard_card1"><Cards stats={stats} /></div>
          <div className="dashboard_container1"><Graph salesData={stats.salesData} /></div>
          <div className="dashboard_container2"><Feed activities={activities} /></div>
          <div className="dashboard_container3"><EmployeeTable /></div>
        </div>
      )}
    </div>
  )
}

export default Dashboard