import React from 'react'
import './Profile.css'

const Profile = () => {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="brand">CanovaCRM</div>
        <h2>Profile</h2>
      </header>

      <div className="profile-form">
        <label>First name</label>
        <input defaultValue="Rajesh" />

        <label>Last name</label>
        <input defaultValue="Mehta" />

        <label>Email</label>
        <input defaultValue="Rajeshmehta03@gmail.com" />

        <label>Password</label>
        <input type="password" defaultValue="***********" />

        <label>Confirm Password</label>
        <input type="password" defaultValue="***********" />

        <div className="profile-actions">
          <button className="btn save">Save</button>
          <button className="btn logout">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Profile