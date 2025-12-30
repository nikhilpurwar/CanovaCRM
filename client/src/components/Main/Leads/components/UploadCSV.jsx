import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeads } from "../../../../redux/slices/leadSlice";
import axiosInstance from "../../../../api/axiosInstance";
import "../lead.css";
import Papa from 'papaparse';

const UploadCSV = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.leads);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const requiredColumns = ['Name', 'Email', 'Source', 'Date', 'Location', 'Language'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
        setFile(files[0]);
        setError('');
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
        setFile(files[0]);
        setError('');
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const validateCSV = (data) => {
    if (!data || data.length === 0) {
      setError('CSV file is empty');
      return false;
    }

    const headers = Object.keys(data[0]);
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      setError(`Missing required columns: ${missingColumns.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (validateCSV(results.data)) {
          try {
            // Prepare data for backend - match required field names
            const leads = results.data.map(row => ({
              firstName: row['Name']?.split(' ')[0] || '',
              lastName: row['Name']?.split(' ').slice(1).join(' ') || '',
              email: row['Email'],
              source: row['Source'],
              leadDate: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString(),
              location: row['Location'],
              language: row['Language']
            })).filter(lead => lead.firstName && lead.email); // Filter valid leads

            if (leads.length === 0) {
              setError('No valid leads found in CSV');
              setUploading(false);
              return;
            }

            // Call backend API to bulk create leads with automatic assignment
            setProgress(50);
            const response = await axiosInstance.post('/leads/bulk-create', { leads });
            
            if (response.data.success) {
              setProgress(100);
              // Refresh the leads list
              dispatch(getAllLeads({ page: 1, limit: 20 }));
              
              setTimeout(() => {
                setUploading(false);
                setProgress(0);
                setFile(null);
                onClose();
              }, 500);
            } else {
              setError(response.data.message || 'Failed to upload leads');
              setUploading(false);
            }
          } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error uploading CSV');
            setUploading(false);
            console.error('Upload error:', err);
          }
        } else {
          setUploading(false);
          setProgress(0);
        }
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setUploading(false);
      }
    });
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Upload Leads CSV</h2>
          <button onClick={onClose} className="closeBtn">✕</button>
        </div>

        <div className="uploadBox">
          {!uploading ? (
            <>
              <div 
                className={`dragDropZone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 2L8 14V44H40V14L24 2Z" stroke="#6366F1" strokeWidth="2" fill="none"/>
                  <path d="M24 14V30M18 24L24 30L30 24" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Drag your CSV file here to upload</p>
                <span>OR</span>
                <label className="outlineBtn">
                  Browse files
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
                {file && (
                  <input
                    type="text"
                    disabled
                    value={file.name}
                    className="sampleInput"
                  />
                )}
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                  Required columns: {requiredColumns.join(', ')}
                </div>
              </div>
              {error && <div style={{ color: '#ff4757', marginTop: '12px', fontSize: '14px' }}>{error}</div>}
            </>
          ) : (
            <>
              <div className="loader" style={{ fontSize: '24px' }}>{progress}%</div>
              <p>Processing your CSV file...</p>
            </>
          )}
        </div>

        <div className="modalFooter">
          <button className="outlineBtn" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button 
            className="primaryBtn" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
