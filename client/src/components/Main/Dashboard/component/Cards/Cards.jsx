import React from 'react';
import './Cards.css';

const Cards = () => {
  // Card data - in a real app, this would come from props or API
  const cardData = [
    {
      id: 1,
      title: "Unassigned Leads",
      value: "12",
      subtitle: "Leads waiting for assignment"
    },
    {
      id: 2,
      title: "Assigned This Week",
      value: "24",
      subtitle: "Leads assigned this week"
    },
    {
      id: 3,
      title: "Active Salespeople",
      value: "5",
      subtitle: "Currently active team members"
    },
    {
      id: 4,
      title: "Conversion Rate",
      value: "32%",
      subtitle: "Overall conversion percentage"
    }
  ];

  return (
    <div className="cards-container">
      {cardData.map((card) => (
        <div key={card.id} className="dashboard-card">
          <h3 className="card-title">{card.title}</h3>
          <div className="card-value">{card.value}</div>
          <div className="card-subtitle">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

export default Cards;