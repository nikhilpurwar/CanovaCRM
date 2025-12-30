import React from 'react';
import { useSelector } from 'react-redux';
import './SalesAnalyticGraph.css';

const SalesAnalyticGraph = () => {
  const { stats } = useSelector(state => state.dashboard);

  // Process sales data for the past 2 weeks
  const salesData = Array.isArray(stats?.salesData) ? stats.salesData : [];
  
  // Generate the past 14 days of data
  const today = new Date();
  const last14Days = [];
  const dataMap = {};

  // Create a map of data by date
  salesData.forEach(item => {
    if (item._id) {
      dataMap[item._id] = item.count;
    }
  });

  // Generate 14 days of data
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = dataMap[dateStr] || 0;
    const conversionRate = count > 0 ? Math.min(100, count * 5) : 0; // Simulated conversion rate
    
    last14Days.push({
      date: dateStr,
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      conversionRate: Math.round(conversionRate),
      count: count
    });
  }

  // Find max for scaling
  const maxRate = Math.max(...last14Days.map(d => d.conversionRate), 60);
  
  // Calculate bar heights (max height 200px)
  const barData = last14Days.map(item => ({
    ...item,
    height: (item.conversionRate / maxRate) * 200
  }));

  // Generate Y-axis labels
  const yAxisLabels = [];
  const step = Math.ceil(maxRate / 5);
  for (let i = Math.ceil(maxRate); i >= 0; i -= step) {
    yAxisLabels.push(`${i}%`);
  }

  return (
    <div className="sales-analytics-container">
      <h3 className="sale-analytics-title">Sale Analytics (Past 2 Weeks)</h3>
      
      <div className="graph-wrapper">
        {/* Y-axis labels */}
        <div className="y-axis">
          {yAxisLabels.map((label, index) => (
            <div key={index} className="y-axis-label">{label}</div>
          ))}
        </div>
        
        {/* Horizontal dashed lines */}
        <div className="horizontal-lines">
          {yAxisLabels.map((_, index) => (
            <div key={index} className="horizontal-line"></div>
          ))}
        </div>
        
        {/* Graph bars */}
        <div className="graph-bars-container">
          {barData.map((bar, index) => (
            <div key={index} className="bar-container">
              <div 
                className="graph-bar" 
                style={{ height: `${bar.height}px` }}
                title={`${bar.conversionRate}% - ${bar.count} leads`}
              ></div>
              <div className="x-axis-label">{bar.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticGraph;