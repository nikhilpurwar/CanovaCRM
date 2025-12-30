import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError, clearSuccess } from '../../../redux/slices/authSlice';
import './setting.css'

const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      setSuccessMsg('Profile updated successfully!');
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setTimeout(() => {
        setSuccessMsg('');
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Only validate password if user is trying to change it
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    };
    
    // Only include password if user is changing it
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    dispatch(updateProfile(updateData));
  };

  return (
    <div className="settings">
      <nav className='navbar'></nav>
      <div className="settingsContainer">
        <div className="navPath">
          <Link to="/dashboard">Home</Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.64167 4.75L0 1.10833L1.10833 0L5.85833 4.75L1.10833 9.5L0 8.39167L3.64167 4.75Z" fill="#979797" />
          </svg>
          <Link>Settings</Link>
        </div>
        <div className="settingForm">
          <div className="formHeader">
            <span style={{ marginLeft: "12px" }}>Edit Profile</span>
            <span className='bottomBorder'></span>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}
            
            <div className="formGroup">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="formGroup">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
            
            <div className="formGroup">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="formGroup">
              <label>New Password (Optional)</label>
              <input 
                type="password" 
                name="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div className="formGroup">
              <label>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            
            <div className="formActions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings