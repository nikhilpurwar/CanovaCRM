import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile, logout } from '../../../redux/authSlice'
import './Profile.css'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setMessage('')
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    // Validate passwords if changed
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setMessage('Password must be at least 6 characters')
        return
      }
    }

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      ...(formData.password && { password: formData.password }),
    }

    dispatch(updateProfile(updateData))
      .unwrap()
      .then(() => {
        setMessage('Profile updated successfully')
        setTimeout(() => setMessage(''), 3000)
      })
      .catch((err) => {
        setMessage(err)
      })
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="brand">CanovaCRM</div>
        <h2>Profile</h2>
      </header>

      <div className="profile-form">
        {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}
        {error && <div className="message error">{error}</div>}
        
        <form onSubmit={handleSave}>
          <label>First name</label>
          <input 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />

          <label>Last name</label>
          <input 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />

          <label>Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            disabled
            placeholder="Email cannot be changed"
          />

          <label>Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />

          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />

          <div className="profile-actions">
            <button type="submit" className="btn save" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile