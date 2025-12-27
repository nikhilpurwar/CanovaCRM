import React from 'react'
import { Link } from "react-router-dom";
import './setting.css'

const Settings = () => {
  return (
    <div className="settings">
      <nav className='navbar'></nav>
      <div className="settingsContainer">
        <div className="navPath">
          <Link>Home</Link>
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
          <form>
            <div className="formGroup">
              <label>First Name</label>
              <input type="text" placeholder="Sarthak" />
            </div>
            <div className="formGroup">
              <label>Last Name</label>
              <input type="text" placeholder="Pal" />
            </div>
            <div className="formGroup">
              <label>Email</label>
              <input type="email" placeholder="Sarthakpal08@gmail.com" />
            </div>
            <div className="formGroup">
              <label>Password</label>
              <input type="password" placeholder="************" />
            </div>
            <div className="formGroup">
              <label>Confirm Password</label>
              <input type="password" placeholder="************" />
            </div>
            <div className="formActions">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings