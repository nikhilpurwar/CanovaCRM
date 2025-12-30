import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLeads } from "../../../redux/leadsSlice";
import { checkIn, checkOut, getTodayAttendance } from "../../../redux/attendanceSlice";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { leads, totalLeads, loading: leadsLoading } = useSelector((state) => state.leads);
  const { checkInTime, checkOutTime, isCheckedIn, totalWorkHours, loading: attendanceLoading } = useSelector((state) => state.attendance);
  const [breakHistory, setBreakHistory] = useState([]);

  useEffect(() => {
    // Fetch employee's assigned leads
    dispatch(fetchMyLeads({ page: 1, limit: 10 }));
    // Fetch today's attendance
    dispatch(getTodayAttendance());
  }, [dispatch]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Format time for display
  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return "--:--";
    }
  };

  // Count leads by status
  const ongoingLeads = leads.filter(lead => lead.status === 'Ongoing').length;
  const closedLeads = leads.filter(lead => lead.status === 'Closed' || lead.status === 'Won').length;

  // Handle check-in
  const handleCheckIn = async () => {
    dispatch(checkIn());
  };

  // Handle check-out
  const handleCheckOut = async () => {
    dispatch(checkOut());
  };

  const loading = leadsLoading || attendanceLoading;

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h3 className="logo">
          Canova<span>CRM</span>
        </h3>
        <p className="greeting">{getGreeting()}</p>
        <h2 className="username">{user?.firstName} {user?.lastName}</h2>
      </header>

      {/* Lead Stats */}
      <section className="section">
        <h3 className="section-title">My Leads</h3>
        <div className="stats-container">
          <div className="stat-card">
            <p className="stat-label">Total Assigned</p>
            <p className="stat-value">{loading ? "..." : totalLeads}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Ongoing</p>
            <p className="stat-value">{loading ? "..." : ongoingLeads}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Closed</p>
            <p className="stat-value">{loading ? "..." : closedLeads}</p>
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="section">
        <h3 className="section-title">Attendance</h3>

        <div className="blue-card">
          <div>
            <p className="label">Check in</p>
            <p className="time">{formatTime(checkInTime)}</p>
          </div>
          <div>
            <p className="label">Check Out</p>
            <p className="time">{formatTime(checkOutTime)}</p>
          </div>
          <button 
            className="check-btn"
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            disabled={loading}
          >
            {loading ? "..." : isCheckedIn ? "Check Out" : "Check In"}
          </button>
        </div>

        <div className="blue-card">
          <div>
            <p className="label">Work Hours</p>
            <p className="time">{totalWorkHours.toFixed(2)}h</p>
          </div>
          <div>
            <p className="label">Status</p>
            <p className="time" style={{ color: isCheckedIn ? '#4CAF50' : '#999' }}>
              {isCheckedIn ? 'Working' : 'Offline'}
            </p>
          </div>
        </div>

        {breakHistory.length > 0 && (
          <div className="history-card">
            <div className="history-head">
              <span>Break</span>
              <span>Ended</span>
              <span>Duration</span>
            </div>
            {breakHistory.map((t, i) => (
              <div className="history-row" key={i}>
                <span>{t.break}</span>
                <span>{t.ended}</span>
                <span>{t.duration}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-card">
          {loading ? (
            <p>Loading activity...</p>
          ) : leads.length === 0 ? (
            <p>No leads assigned yet</p>
          ) : (
            <ul>
              <li>You have {totalLeads} lead{totalLeads !== 1 ? 's' : ''} assigned</li>
              <li>{ongoingLeads} ongoing lead{ongoingLeads !== 1 ? 's' : ''} to follow up</li>
              {closedLeads > 0 && <li>{closedLeads} deal{closedLeads !== 1 ? 's' : ''} closed</li>}
              {isCheckedIn && <li style={{ color: '#4CAF50' }}>✓ You are checked in</li>}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;