import React from 'react';
import './ActivityFeedCard.css';

const ActivityFeedCard = () => {
  // Activity data - in a real app, this would come from props or API
  const activities = [
    {
      id: 1,
      text: "You assigned a lead to Priya",
      time: "1 hour ago",
      type: "assignment"
    },
    {
      id: 2,
      text: "Jay closed a deal",
      time: "2 hours ago",
      type: "deal"
    },
    {
      id: 3,
      text: "New lead added from website",
      time: "3 hours ago",
      type: "lead"
    },
    {
      id: 4,
      text: "Monthly sales target achieved",
      time: "4 hours ago",
      type: "achievement"
    },
    {
      id: 5,
      text: "Team meeting scheduled",
      time: "5 hours ago",
      type: "meeting"
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'assignment':
        return <div className="activity-icon assignment-icon"><svg></svg></div>;
      case 'deal':
        return <div className="activity-icon deal-icon"><svg></svg></div>;
      case 'lead':
        return <div className="activity-icon lead-icon"><svg></svg></div>;
      case 'achievement':
        return <div className="activity-icon achievement-icon"><svg></svg></div>;
      case 'meeting':
        return <div className="activity-icon meeting-icon"><svg></svg></div>;
      default:
        return <div className="activity-icon default-icon"><svg></svg></div>;
    }
  };

  return (
    <div className="activity-feed-card">
      <h3 className="activity-feed-title">Recent Activity Feed</h3>
      
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-content">
              {getActivityIcon(activity.type)}
              <div className="activity-text-container">
                <span className="activity-text">{activity.text}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-all-container">
        <button className="view-all-button">View All Activity</button>
      </div>
    </div>
  );
};

export default ActivityFeedCard;