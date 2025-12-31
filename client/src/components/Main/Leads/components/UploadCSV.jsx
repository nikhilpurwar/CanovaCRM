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
      <div className="uploadModal" onClick={(e) => e.stopPropagation()}>

        {/* ===== Title Section ===== */}
        <div className="titleSection">
          <div className="titleLeft">
            <h3 className="title">CSV Upload</h3>
            <p className="subtitle">Add your documents here</p>
          </div>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        {/* ===== Upload Area ===== */}
        {!uploading ? (
          <div
            className={`dragDropZone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >

            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2_5906)">
                <path d="M33.4418 3.12109H14.1744V11.1111H37.5569V7.23451C37.5569 4.96616 35.7108 3.12109 33.4418 3.12109Z" fill="#00181B" fill-opacity="0.25" />
                <path d="M22.5352 12.3403H0V4.92636C0 2.20972 2.21068 0 4.92828 0H12.1336C12.8497 0 13.5396 0.150925 14.1664 0.434509C15.0418 0.828964 15.7939 1.47913 16.3213 2.3286L22.5352 12.3403Z" fill="#00181B" />
                <path d="M42 14.0004V37.8817C42 40.153 40.1511 42.0003 37.8789 42.0003H4.12111C1.84891 42.0003 0 40.153 0 37.8817V9.88086H37.8789C40.1511 9.88086 42 11.7288 42 14.0004Z" fill="#00181B" />
                <path d="M42 14.0004V37.8817C42 40.153 40.1511 42.0003 37.8789 42.0003H21V9.88086H37.8789C40.1511 9.88086 42 11.7288 42 14.0004Z" fill="#00181B" />
                <path d="M32.0479 25.9395C32.0479 32.032 27.0918 36.9884 21 36.9884C14.9082 36.9884 9.95206 32.032 9.95206 25.9395C9.95206 19.8481 14.9082 14.8916 21 14.8916C27.0918 14.8916 32.0479 19.8481 32.0479 25.9395Z" fill="white" />
                <path d="M32.0479 25.9395C32.0479 32.032 27.0918 36.9884 21 36.9884V14.8916C27.0918 14.8916 32.0479 19.8481 32.0479 25.9395Z" fill="#00181B" fill-opacity="0.25" />
                <path d="M24.561 26.0758C24.3306 26.2709 24.0483 26.3661 23.7686 26.3661C23.4183 26.3661 23.0703 26.2177 22.8268 25.9287L22.2305 25.2218V29.8499C22.2305 30.5292 21.6793 31.0803 21 31.0803C20.3207 31.0803 19.7695 30.5292 19.7695 29.8499V25.2218L19.1732 25.9287C18.7342 26.4481 17.9584 26.5145 17.439 26.0758C16.9199 25.6378 16.8533 24.8617 17.2913 24.3422L19.7269 21.4548C20.0445 21.0793 20.5078 20.8633 21 20.8633C21.4922 20.8633 21.9555 21.0793 22.2731 21.4548L24.7087 24.3422C25.1467 24.8617 25.0801 25.6378 24.561 26.0758Z" fill="#00181B" />
                <path d="M24.561 26.0758C24.3306 26.2709 24.0483 26.3661 23.7686 26.3661C23.4183 26.3661 23.0703 26.2177 22.8268 25.9287L22.2305 25.2218V29.8499C22.2305 30.5292 21.6793 31.0803 21 31.0803V20.8633C21.4922 20.8633 21.9555 21.0793 22.2731 21.4548L24.7087 24.3422C25.1467 24.8617 25.0801 25.6378 24.561 26.0758Z" fill="#00181B" />
              </g>
              <defs>
                <clipPath id="clip0_2_5906">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>


            <div className="uploadTextGroup">
              <p style={{fontSize: 12}}>Drag your file(s) to start uploading</p>

              <div className="divider">
                <span className="dividerLine"/>
                <span className="dividerText">OR</span>
                <span className="dividerLine" />
              </div>

              <label className="outlineBtn">
                Browse files
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
              {/* <label className="outlineSmallBtn">
                Browse files
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileSelect}
                />
              </label> */}
            </div>

            <div className="fileRow">
              <span className="fileName">
                {file ? file.name : 'Sample File.csv'}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 11.575C7.86667 11.575 7.74167 11.5543 7.625 11.513C7.50833 11.4717 7.4 11.4007 7.3 11.3L3.7 7.7C3.5 7.5 3.404 7.26667 3.412 7C3.42 6.73334 3.516 6.5 3.7 6.3C3.9 6.1 4.13767 5.996 4.413 5.988C4.68833 5.98 4.92567 6.07567 5.125 6.275L7 8.15V1C7 0.71667 7.096 0.479337 7.288 0.288004C7.48 0.0966702 7.71733 0.000670115 8 3.44827e-06C8.28267 -0.000663218 8.52033 0.0953369 8.713 0.288004C8.90567 0.48067 9.00133 0.718003 9 1V8.15L10.875 6.275C11.075 6.075 11.3127 5.979 11.588 5.987C11.8633 5.995 12.1007 6.09934 12.3 6.3C12.4833 6.5 12.5793 6.73334 12.588 7C12.5967 7.26667 12.5007 7.5 12.3 7.7L8.7 11.3C8.6 11.4 8.49167 11.471 8.375 11.513C8.25833 11.555 8.13333 11.5757 8 11.575ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196666 15.0217 0.000666667 14.5507 0 14V12C0 11.7167 0.0960001 11.4793 0.288 11.288C0.48 11.0967 0.717333 11.0007 1 11C1.28267 10.9993 1.52033 11.0953 1.713 11.288C1.90567 11.4807 2.00133 11.718 2 12V14H14V12C14 11.7167 14.096 11.4793 14.288 11.288C14.48 11.0967 14.7173 11.0007 15 11C15.2827 10.9993 15.5203 11.0953 15.713 11.288C15.9057 11.4807 16.0013 11.718 16 12V14C16 14.55 15.8043 15.021 15.413 15.413C15.0217 15.805 14.5507 16.0007 14 16H2Z" fill="#878787" />
              </svg>

            </div>
          </div>
        ) : (
          /* ===== Verifying State (Step-8) ===== */
          <div className="uploadProgressWrap">
            <div className="progressCircle">
              <span className="progressValue">{progress}%</span>
            </div>

            <div className="progressInfo">
              <p>Verifying...</p>
              <button className="outlineSmallBtn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ===== Footer Buttons ===== */}
        <div className="footerButtons">
          <button
            className="outlineBtn"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            className="primaryBtn"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Upload' : (
              <>
                Next
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M7 4L13 10L7 16" fill="none" stroke="white" strokeWidth="2" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>
    </div>

  );
};

export default UploadCSV;
