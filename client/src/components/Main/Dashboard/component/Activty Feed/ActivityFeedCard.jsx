import React from 'react';
import './ActivityFeedCard.css';

const ActivityFeedCard = ({ activities = [] }) => {
  
  const getActivityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'lead':
        return (
          <div className="activity-icon lead-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1L2 5V10C2 15.5 10 19 10 19C10 19 18 15.5 18 10V5L10 1Z" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
        );
      case 'note':
      case 'assignment':
        return (
          <div className="activity-icon assignment-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 1H17C18.1 1 19 1.9 19 3V17C19 18.1 18.1 19 17 19H3C1.9 19 1 18.1 1 17V3C1 1.9 1.9 1 3 1Z" stroke="#F59E0B" strokeWidth="1.5" fill="none"/>
              <path d="M5 5H15M5 10H15M5 15H12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="activity-icon default-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="#6B7280" strokeWidth="1.5" fill="none"/>
              <path d="M10 6V10L13 13" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        );
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    return date.toLocaleDateString();
  };

  const displayActivities = activities && activities.length > 0 ? activities : [];

  return (
    <div className="activity-feed-card">
      <h3 className="activity-feed-title">Recent Activity Feed</h3>
      
      <div className="activities-list">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => (
            <div key={activity._id} className="activity-item">
              <div className="activity-content">
                {getActivityIcon(activity.type)}
                <div className="activity-text-container">
                  <span className="activity-text">{activity.text}</span>
                  <span className="activity-time">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            No activities yet
          </div>
        )}
      </div>
      
      <div className="view-all-container">
        <button className="view-all-button">View All Activity</button>
      </div>
    </div>
  );
};

export default ActivityFeedCard;