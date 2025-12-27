import React from "react";
import "../lead.css";

const AddNewLeadManual = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>Add New Lead</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="formBody">
          <label>Name</label>
          <input type="text" placeholder="Enter name" />

          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Source</label>
          <input type="text" placeholder="Referral" />

          <label>Date</label>
          <input type="date" />

          <label>Location</label>
          <input type="text" placeholder="Mumbai" />

          <label>Preferred Language</label>
          <input type="text" placeholder="Marathi" />
        </div>

        <div className="modalFooter">
          <button className="primaryBtn disabled">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewLeadManual;
