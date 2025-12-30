import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './addEditEmployee.css'
import { createEmployee } from '../../../../redux/slices/employeeSlice'

const AddEditEmployee = ({ onClose }) => {

  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.employees)
  
  const [infoTootip, setInfoTootip] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    preferredLanguage: 'English',
    phone: '',
    department: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields')
      return
    }
    dispatch(createEmployee(formData)).then(() => {
      onClose()
    })
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="employeeModal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>Add New Employee</h3>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        <form className="employeeForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName"
              placeholder="Enter first name" 
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName"
              placeholder="Enter last name" 
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Phone</label>
            <input 
              type="text" 
              name="phone"
              placeholder="Enter phone" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Location</label>
            <input 
              type="text" 
              name="location"
              placeholder="Enter Location" 
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className='formGroupInfo'>
            <div className="formGroup">
              <label>Preferred Language</label>
              <input 
                type="text" 
                name="preferredLanguage"
                placeholder="your preferred language" 
                value={formData.preferredLanguage}
                onChange={handleChange}
              />
            </div>

            <div 
              className='tooltipIcon'
              onMouseEnter={() => setInfoTootip(true)}
              onMouseLeave={() => setInfoTootip(false)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 8.97978C9 8.71456 9.10536 8.46021 9.29289 8.27267C9.48043 8.08514 9.73478 7.97978 10 7.97978C10.2652 7.97978 10.5196 8.08514 10.7071 8.27267C10.8946 8.46021 11 8.71456 11 8.97978V14.9798C11 15.245 10.8946 15.4994 10.7071 15.6869C10.5196 15.8744 10.2652 15.9798 10 15.9798C9.73478 15.9798 9.48043 15.8744 9.29289 15.6869C9.10536 15.4994 9 15.245 9 14.9798V8.97978ZM10 4.05078C9.73478 4.05078 9.48043 4.15614 9.29289 4.34367C9.10536 4.53121 9 4.78556 9 5.05078C9 5.316 9.10536 5.57035 9.29289 5.75789C9.48043 5.94542 9.73478 6.05078 10 6.05078C10.2652 6.05078 10.5196 5.94542 10.7071 5.75789C10.8946 5.57035 11 5.316 11 5.05078C11 4.78556 10.8946 4.53121 10.7071 4.34367C10.5196 4.15614 10.2652 4.05078 10 4.05078Z" fill="#929292" />
              </svg>
              {infoTootip && <div className="infoTooltip">Select employee preferred language</div>}
            </div>
          </div>

          <div className="formGroup">
            <label>Department</label>
            <input 
              type="text" 
              name="department"
              placeholder="Enter department" 
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="modalActions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditEmployee
