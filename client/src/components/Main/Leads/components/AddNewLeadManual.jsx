import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLead, getAllLeads } from "../../../../redux/slices/leadSlice";
import "../lead.css";

const AddNewLeadManual = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading: leadLoading } = useSelector(state => state.leads);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
    leadDate: new Date().toISOString().split('T')[0],
    location: '',
    language: ''
  });
  
  const [errors, setErrors] = useState({});

  const languages = ['English', 'Marathi', 'Kannada', 'Hindi', 'Bengali'];
  const sources = ['Website', 'Referral', 'Social Media', 'Email', 'Phone', 'Event', 'Other'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.source.trim()) newErrors.source = 'Source is required';
    if (!formData.leadDate) newErrors.leadDate = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.language.trim()) newErrors.language = 'Language is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || formData.name.trim();
      
      const leadData = {
        firstName,
        lastName,
        email: formData.email,
        source: formData.source,
        leadDate: formData.leadDate,
        location: formData.location,
        language: formData.language,
        assignedTo: formData.assignedTo || undefined,
        scheduledDate: formData.scheduledDate || undefined
      };
      
      await dispatch(createLead(leadData)).unwrap();
      // Refresh the leads list
      dispatch(getAllLeads({ page: 1, limit: 20 }));
      // Close modal after successful submission
      setTimeout(() => onClose(), 500);
    } catch (error) {
      console.error('Error creating lead:', error);
      setErrors({ submit: 'Failed to create lead. Please try again.' });
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Add New Lead</h2>
          <button onClick={onClose} className="closeBtn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="formBody">
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <div className="formGroup">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter full name" 
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
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
            <label>Source</label>
            <select 
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={errors.source ? 'error' : ''}
            >
              <option value="">Select source</option>
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
            {errors.source && <span className="error-text">{errors.source}</span>}
          </div>

          <div className="formGroup">
            <label>Date</label>
            <input 
              type="date" 
              name="leadDate"
              value={formData.leadDate}
              onChange={handleChange}
              className={errors.leadDate ? 'error' : ''}
            />
            {errors.leadDate && <span className="error-text">{errors.leadDate}</span>}
          </div>

          <div className="formGroup">
            <label>Location</label>
            <input 
              type="text" 
              name="location"
              placeholder="e.g., Mumbai" 
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="formGroup">
            <label>Preferred Language</label>
            <select 
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={errors.language ? 'error' : ''}
            >
              <option value="">Select language</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {errors.language && <span className="error-text">{errors.language}</span>}
          </div>

          <div className="modalFooter">
            <button 
              type="button" 
              className="secondaryBtn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primaryBtn"
              disabled={leadLoading}
            >
              {leadLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLeadManual;
