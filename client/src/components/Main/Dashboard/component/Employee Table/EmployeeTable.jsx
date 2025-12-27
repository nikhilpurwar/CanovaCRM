import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = () => {
  // Employee data - in a real app, this would come from props or API
  const employees = [
    {
      id: 1,
      name: "Tanner Finsha",
      email: "Tannerfisher@gmail.com",
      employeeId: "#23454GH6J7Y16",
      assignedLeads: 5,
      closedLeads: 2,
      status: "Active"
    },
    {
      id: 2,
      name: "Emeto Winner",
      email: "Emetowinner@gmail.com",
      employeeId: "#23454GH6J7Y16",
      assignedLeads: 3,
      closedLeads: 1,
      status: "Active"
    },
    {
      id: 3,
      name: "Emeto Winner",
      email: "Emetowinner@gmail.com",
      employeeId: "#23454GH6J7Y16",
      assignedLeads: 8,
      closedLeads: 3,
      status: "Active"
    },
    {
      id: 4,
      name: "Tassy Omah",
      email: "Tassyomah@gmail.com",
      employeeId: "#23454GH6J7Y16",
      assignedLeads: 6,
      closedLeads: 4,
      status: "Active"
    }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#C7B9DA', '#FFF2EA', '#E0F2FE', '#F0F9FF', '#FEF3F2'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getConversionRate = (assigned, closed) => {
    if (assigned === 0) return "0%";
    return Math.round((closed / assigned) * 100) + "%";
  };

  return (
    <div className="employee-table-container">
      <h3 className="table-title">Sales Team Performance</h3>
      
      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Assigned Leads</th>
              <th>Closed Leads</th>
              <th>Conversion Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-info-cell">
                    <div 
                      className="employee-avatar"
                      style={{ backgroundColor: getAvatarColor(employee.name) }}
                    >
                      <span className="avatar-initials">{getInitials(employee.name)}</span>
                    </div>
                    <div className="employee-details">
                      <div className="employee-name">{employee.name}</div>
                      <div className="employee-email">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.employeeId}</td>
                <td>{employee.assignedLeads}</td>
                <td>{employee.closedLeads}</td>
                <td>{getConversionRate(employee.assignedLeads, employee.closedLeads)}</td>
                <td>
                  <span className={`status-badge ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td>
                  <button className="action-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      {/* Three dot vertical icon */}
                      <circle cx="10" cy="4" r="1.5" fill="#98A2B3"/>
                      <circle cx="10" cy="10" r="1.5" fill="#98A2B3"/>
                      <circle cx="10" cy="16" r="1.5" fill="#98A2B3"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <div className="table-summary">
          Showing {employees.length} of {employees.length} employees
        </div>
        <div className="table-pagination">
          <button className="pagination-button prev" disabled>Previous</button>
          <span className="pagination-page">1</span>
          <button className="pagination-button next">Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;