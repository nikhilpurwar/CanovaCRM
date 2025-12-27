import React from 'react';
import './SalesAnalyticGraph.css';

const SalesAnalyticGraph = () => {
  // Graph data - in a real app, this would come from props or API
  const barData = [
    { day: 'Sat', value: 40, height: 147 },
    { day: 'Sun', value: 54, height: 200 },
    { day: 'Mon', value: 41, height: 150 },
    { day: 'Tue', value: 33, height: 120 },
    { day: 'Wed', value: 27, height: 100 },
    { day: 'Thu', value: 40, height: 147 },
    { day: 'Fri', value: 46, height: 170 },
    { day: 'Sat', value: 82, height: 300 },
    { day: 'Sun', value: 68, height: 250 },
    { day: 'Mon', value: 57, height: 210 },
    { day: 'Tue', value: 40, height: 147 },
    { day: 'Wed', value: 46, height: 170 },
    { day: 'Thu', value: 43, height: 160 },
    { day: 'Fri', value: 14, height: 50 }
  ];

  const yAxisLabels = ['60%', '50%', '40%', '30%', '20%', '10%', '0%'];

  return (
    <div className="sales-analytics-container">
      <h3 className="sale-analytics-title">Sale Analytics</h3>
      
      <div className="graph-wrapper">
        {/* Y-axis labels */}
        <div className="y-axis">
          {yAxisLabels.map((label, index) => (
            <div key={index} className="y-axis-label">{label}</div>
          ))}
        </div>
        
        {/* Horizontal dashed lines */}
        <div className="horizontal-lines">
          {[0, 1, 2, 3, 4, 5, 6].map((line) => (
            <div key={line} className="horizontal-line"></div>
          ))}
        </div>
        
        {/* Graph bars */}
        <div className="graph-bars-container">
          {barData.map((bar, index) => (
            <div key={index} className="bar-container">
              <div 
                className="graph-bar" 
                style={{ height: `${bar.height}px` }}
                title={`${bar.value}%`}
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