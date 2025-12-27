import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './employees.css'
import AddEditEmployee from './Add Edit Employee/AddEditEmployee';

const Employee = () => {

  const [showActions, setShowActions] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10

  const pages = [1, 2, 3, '...', 8, 9, 10]

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1)
  }

  return (
    <div className="employee">
      <nav className='navbar'>
        <div class="search-bar">
          <div class="search-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.1333 24L13.7333 15.6C13.0667 16.1333 12.3 16.5556 11.4333 16.8667C10.5667 17.1778 9.64445 17.3333 8.66667 17.3333C6.24444 17.3333 4.19444 16.4944 2.51667 14.8167C0.838889 13.1389 0 11.0889 0 8.66667C0 6.24444 0.838889 4.19444 2.51667 2.51667C4.19444 0.838889 6.24444 0 8.66667 0C11.0889 0 13.1389 0.838889 14.8167 2.51667C16.4944 4.19444 17.3333 6.24444 17.3333 8.66667C17.3333 9.64445 17.1778 10.5667 16.8667 11.4333C16.5556 12.3 16.1333 13.0667 15.6 13.7333L24 22.1333L22.1333 24ZM8.66667 14.6667C10.3333 14.6667 11.75 14.0833 12.9167 12.9167C14.0833 11.75 14.6667 10.3333 14.6667 8.66667C14.6667 7 14.0833 5.58333 12.9167 4.41667C11.75 3.25 10.3333 2.66667 8.66667 2.66667C7 2.66667 5.58333 3.25 4.41667 4.41667C3.25 5.58333 2.66667 7 2.66667 8.66667C2.66667 10.3333 3.25 11.75 4.41667 12.9167C5.58333 14.0833 7 14.6667 8.66667 14.6667Z" fill="#636060" />
            </svg>
          </div>
          <input type="text" placeholder="Search here..." class="search-input" />
        </div>
      </nav>
      <div className="employeeContainer">
        <div className="navPath">
          <div>
            <Link>Home </Link>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.64167 4.75L0 1.10833L1.10833 0L5.85833 4.75L1.10833 9.5L0 8.39167L3.64167 4.75Z" fill="#979797" />
            </svg>
            <Link> Settings</Link>
          </div>
          <button
            className="AddEmployeeBtn"
            type="submit"
            onClick={() => setShowEmployeeModal(true)}
          >
            Add Employee
          </button>
        </div>
        <div className="employeeTable">
          <div className='fake'></div>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Assigned Leads</th>
                <th>Closed Leads</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row}>
                  <td><input type="checkbox" /></td>

                  <td>
                    <div className="user">
                      <div className="avatar">TF</div>
                      <div className="user-info">
                        <span>Tanner Finsha</span>
                        <span>tanner@gmail.com</span>
                      </div>
                    </div>
                  </td>

                  <td><span className="badge">#23454GH</span></td>
                  <td>5</td>
                  <td>2</td>

                  <td>
                    <span className="status active">
                      <span className="dot"></span> Active
                    </span>
                  </td>

                  <td className="actions">
                    <span
                      className="three-dots"
                      onClick={() =>
                        setShowActions(showActions === row ? null : row)
                      }
                    >
                      ⋮
                    </span>

                    {showActions === row && (
                      <div className="actionsMenuWrapper" onClick={() => setShowActions(null)}>
                        <div className="actionMenu">
                          <div className='edit' onClick={() => {
                            setShowEmployeeModal(true)
                            setShowActions(null)
                          }}>
                            <span className='edit-icon'>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 12H2.56875L9.9 4.66875L8.83125 3.6L1.5 10.9313V12ZM0 13.5V10.3125L9.9 0.43125C10.05 0.29375 10.2158 0.1875 10.3973 0.1125C10.5788 0.0375001 10.7692 0 10.9688 0C11.1683 0 11.362 0.0375001 11.55 0.1125C11.738 0.1875 11.9005 0.3 12.0375 0.45L13.0687 1.5C13.2187 1.6375 13.3283 1.8 13.3973 1.9875C13.4663 2.175 13.5005 2.3625 13.5 2.55C13.5 2.75 13.4658 2.94075 13.3973 3.12225C13.3288 3.30375 13.2192 3.46925 13.0687 3.61875L3.1875 13.5H0ZM9.35625 4.14375L8.83125 3.6L9.9 4.66875L9.35625 4.14375Z" fill="black" />
                              </svg>
                            </span>
                            <span>Edit</span>
                          </div>
                          <div className="delete">
                            <span className='delete-icon'>
                              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.25 13.5C1.8375 13.5 1.4845 13.3533 1.191 13.0597C0.897502 12.7662 0.750503 12.413 0.750003 12V2.25C0.537503 2.25 0.359503 2.178 0.216003 2.034C0.0725027 1.89 0.000502586 1.712 2.5862e-06 1.5C-0.000497414 1.288 0.0715027 1.11 0.216003 0.966C0.360503 0.822 0.538503 0.75 0.750003 0.75H3.75C3.75 0.5375 3.822 0.3595 3.966 0.216C4.11 0.0725001 4.288 0.0005 4.5 0H7.5C7.7125 0 7.89075 0.0720001 8.03475 0.216C8.17875 0.36 8.2505 0.538 8.25 0.75H11.25C11.4625 0.75 11.6408 0.822 11.7848 0.966C11.9288 1.11 12.0005 1.288 12 1.5C11.9995 1.712 11.9275 1.89025 11.784 2.03475C11.6405 2.17925 11.4625 2.251 11.25 2.25V12C11.25 12.4125 11.1033 12.7657 10.8098 13.0597C10.5163 13.3538 10.163 13.5005 9.75 13.5H2.25ZM9.75 2.25H2.25V12H9.75V2.25ZM4.5 10.5C4.7125 10.5 4.89075 10.428 5.03475 10.284C5.17875 10.14 5.2505 9.962 5.25 9.75V4.5C5.25 4.2875 5.178 4.1095 5.034 3.966C4.89 3.8225 4.712 3.7505 4.5 3.75C4.288 3.7495 4.11 3.8215 3.966 3.966C3.822 4.1105 3.75 4.2885 3.75 4.5V9.75C3.75 9.9625 3.822 10.1407 3.966 10.2847C4.11 10.4287 4.288 10.5005 4.5 10.5ZM7.5 10.5C7.7125 10.5 7.89075 10.428 8.03475 10.284C8.17875 10.14 8.2505 9.962 8.25 9.75V4.5C8.25 4.2875 8.178 4.1095 8.034 3.966C7.89 3.8225 7.712 3.7505 7.5 3.75C7.288 3.7495 7.11 3.8215 6.966 3.966C6.822 4.1105 6.75 4.2885 6.75 4.5V9.75C6.75 9.9625 6.822 10.1407 6.966 10.2847C7.11 10.4287 7.288 10.5005 7.5 10.5Z" fill="#00252A" />
                              </svg>
                            </span>
                            <span>Delete</span>
                          </div>
                        </div>
                      </div>

                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                  className={`paginationNumber ${currentPage === page ? 'active' : ''
                    }`}
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
      {/* ADD / EDIT MODAL */}
      {showEmployeeModal && (
        <AddEditEmployee onClose={() => setShowEmployeeModal(false)} />
      )}
    </div>
  )
}

export default Employee