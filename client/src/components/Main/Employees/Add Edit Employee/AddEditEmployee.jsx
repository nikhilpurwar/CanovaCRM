import React, { useState } from 'react'
import './addEditEmployee.css'

const AddEditEmployee = ({ onClose }) => {

  const [infoTootip, setInfoTootip] = useState(false);

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="employeeModal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>Add New Employee</h3>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        <form className="employeeForm">
          <div className="formGroup">
            <label>First Name</label>
            <input type="text" placeholder="Enter first name" />
          </div>

          <div className="formGroup">
            <label>Last Name</label>
            <input type="text" placeholder="Enter last name" />
          </div>

          <div className="formGroup">
            <label>Email</label>
            <input type="email" placeholder="Enter email" />
          </div>

          <div className="formGroup">
            <label>Location</label>
            <input type="text" placeholder="Enter Location" />
          </div>

          <div className='formGroupInfo'>
            <div className="formGroup">
              <label>Preferred Language</label>
              <input type="text" placeholder="your preferred language" />
            </div>

            <div 
              className='tooltipIcon'
              onMouseEnter={() => setInfoTootip(true)}
              onMouseLeave={() => setInfoTootip(false)}
            >

              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 8.97978C9 8.71456 9.10536 8.46021 9.29289 8.27267C9.48043 8.08514 9.73478 7.97978 10 7.97978C10.2652 7.97978 10.5196 8.08514 10.7071 8.27267C10.8946 8.46021 11 8.71456 11 8.97978V14.9798C11 15.245 10.8946 15.4994 10.7071 15.6869C10.5196 15.8744 10.2652 15.9798 10 15.9798C9.73478 15.9798 9.48043 15.8744 9.29289 15.6869C9.10536 15.4994 9 15.245 9 14.9798V8.97978ZM10 4.05078C9.73478 4.05078 9.48043 4.15614 9.29289 4.34367C9.10536 4.53121 9 4.78556 9 5.05078C9 5.316 9.10536 5.57035 9.29289 5.75789C9.48043 5.94542 9.73478 6.05078 10 6.05078C10.2652 6.05078 10.5196 5.94542 10.7071 5.75789C10.8946 5.57035 11 5.316 11 5.05078C11 4.78556 10.8946 4.53121 10.7071 4.34367C10.5196 4.15614 10.2652 4.05078 10 4.05078Z" fill="#929292" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10Z" fill="#929292" />
              </svg>

              {infoTootip && (
                <div className="infoTooltip show">
                  Lead will be assigned on biases on language
                </div>
              )}
            </div>
          </div>

          <div className="modalActions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditEmployee
