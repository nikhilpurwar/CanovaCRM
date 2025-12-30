import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './lead.css'
import UploadCSV from './components/UploadCSV';
import AddNewLeadManual from './components/AddNewLeadManual';
import { getAllLeads, deleteLead } from '../../../redux/slices/leadSlice';

const Leads = () => {
  const dispatch = useDispatch();
  const { leads = [], loading, pagination = {} } = useSelector(state => state.leads);
  const [showActions, setShowActions] = useState(null)
  const [showCSV, setShowCSV] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(getAllLeads({ page: currentPage, limit: 20, filters: { search: searchTerm } }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDeleteLead = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLead(id));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1)
  }

  const handleNext = () => {
    if (currentPage < (pagination.pages || 1)) setCurrentPage(p => p + 1)
  }

  // Generate pagination pages
  const totalPages = pagination.pages || 1;
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Ongoing': 'ongoing',
      'Hot': 'hot',
      'Warm': 'warm',
      'Cold': 'cold',
      'Scheduled': 'scheduled',
      'Won': 'won',
      'Lost': 'lost'
    };
    return statusMap[status] || 'ongoing';
  };

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
            placeholder="Search leads..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </nav>
      <div className="employeeContainer">
        <div className="navPath">
          <div>
            <Link>Home </Link>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.64167 4.75L0 1.10833L1.10833 0L5.85833 4.75L1.10833 9.5L0 8.39167L3.64167 4.75Z" fill="#979797" />
            </svg>
            <Link> Leads</Link>
          </div>
          <div className='btnGroup'>
            <button
              className="AddEmployeeBtn"
              onClick={() => setShowManual(true)}
            >
              Add Manually
            </button>

            <button
              className="AddEmployeeBtn"
              onClick={() => setShowCSV(true)}
            >
              Add CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading leads...</div>
        ) : (
          <>
            <div className="employeeTable">
              <table className="leadsTable">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Language</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Scheduled Date</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>

                <tbody>
                  {leads && leads.length > 0 ? (
                    leads.map((lead, index) => (
                      <tr key={lead._id}>
                        <td>{(currentPage - 1) * 20 + index + 1}</td>
                        <td>{lead.firstName} {lead.lastName}</td>
                        <td>{lead.email}</td>
                        <td>{lead.source || '-'}</td>
                        <td>{formatDate(lead.leadDate)}</td>
                        <td>{lead.location || '-'}</td>
                        <td>{lead.language || '-'}</td>
                        <td>{lead.assignedTo?.firstName || 'Unassigned'}</td>
                        <td>
                          <span className={`status ${getStatusBadge(lead.status)}`}>{lead.status || 'Ongoing'}</span>
                        </td>
                        <td>{lead.type || '-'}</td>
                        <td>{formatDate(lead.scheduledDate)}</td>
                        {/* <td>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteLead(lead._id)}
                            title="Delete lead"
                          >
                            🗑️
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        No leads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="paginationContainer">
                <button
                  className="paginationBtn"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="paginationNumbers">
                  {pages.map((page, index) =>
                    page === '...' ? (
                      <span key={index} className="paginationDots">…</span>
                    ) : (
                      <button
                        key={page}
                        className={`paginationNumber ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="paginationBtn"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showCSV && <UploadCSV onClose={() => setShowCSV(false)} />}
      {showManual && <AddNewLeadManual onClose={() => setShowManual(false)} />}
    </div>
  )
}

export default Leads