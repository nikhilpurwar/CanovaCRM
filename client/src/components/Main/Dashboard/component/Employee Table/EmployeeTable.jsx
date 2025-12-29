import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees } from '../../../../../redux/slices/employeeSlice';
import './EmployeeTable.css';

const EmployeeTable = () => {
  const dispatch = useDispatch();
  const { employees = [] } = useSelector(state => state.employees);
  
  useEffect(() => {
    dispatch(getAllEmployees({ page: 1, limit: 4 }));
  }, [dispatch]);
  
  // Get only active employees (max 4 for dashboard display)
  const activeEmployees = employees.filter(emp => emp.status === 'Active').slice(0, 4);

  const getInitials = (firstName = '', lastName = '') => {
    return `${(firstName.charAt(0) || '').toUpperCase()}${(lastName.charAt(0) || '').toUpperCase()}`;
  };

  const getAvatarColor = (id) => {
    const colors = ['#C7B9DA', '#FFF2EA', '#E0F2FE', '#F0F9FF', '#FEF3F2'];
    const index = (id.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const getConversionRate = (assigned, closed) => {
    if (assigned === 0) return "0%";
    return Math.round((closed / assigned) * 100) + "%";
  };

  if (activeEmployees.length === 0) {
    return (
      <div className="employee-table-container">
        <h3 className="table-title">Sales Team Performance</h3>
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
          No active employees found
        </div>
      </div>
    );
  }

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
            {activeEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <div className="employee-info-cell">
                    <div 
                      className="employee-avatar"
                      style={{ backgroundColor: getAvatarColor(employee._id) }}
                    >
                      <span className="avatar-initials">{getInitials(employee.firstName, employee.lastName)}</span>
                    </div>
                    <div className="employee-details">
                      <div className="employee-name">{employee.firstName} {employee.lastName}</div>
                      <div className="employee-email">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td>{employee._id.slice(-8).toUpperCase()}</td>
                <td>{employee.assignedLeads || 0}</td>
                <td>{employee.closedLeads || 0}</td>
                <td>{getConversionRate(employee.assignedLeads || 0, employee.closedLeads || 0)}</td>
                <td>
                  <span className={`status-badge ${(employee.status || 'Active').toLowerCase()}`}>
                    {employee.status || 'Active'}
                  </span>
                </td>
                <td>
                  <button className="action-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
          Showing {activeEmployees.length} of {activeEmployees.length} active employees
        </div>
        <div className="table-pagination">
          <button className="pagination-button prev" disabled>Previous</button>
          <span className="pagination-page">1</span>
          <button className="pagination-button next" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;