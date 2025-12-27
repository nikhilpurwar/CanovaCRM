import React, { useState } from "react";
import "../lead.css";

const UploadCSV = ({ onClose }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    // simulate verification
    setTimeout(() => {
      setUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>CSV Upload</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="uploadBox">
          {!uploading ? (
            <>
              <p>Drag your file(s) to start uploading</p>
              <span>OR</span>
              <button className="outlineBtn">Browse files</button>
              <input
                type="text"
                disabled
                value="Sample File.csv"
                className="sampleInput"
              />
            </>
          ) : (
            <>
              <div className="loader">60%</div>
              <p>Verifying...</p>
              <button className="outlineBtn">Cancel</button>
            </>
          )}
        </div>

        <div className="modalFooter">
          <button className="outlineBtn" onClick={onClose}>
            Cancel
          </button>
          <button className="primaryBtn" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
