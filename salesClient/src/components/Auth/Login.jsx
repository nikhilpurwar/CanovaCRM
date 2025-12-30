import React from "react";
import "./Login.css";

const Login = () => {
    return (
        <div className="login-container">
            {/* Header */}
            <div className='header'>
                Canova<span>CRM</span>
            </div>

            {/* Form */}
            <form className="login-form">
                <div className="form-group">
                    {/* <label htmlFor="email" className="form-label">Email</label> */}
                    <input type="email" id="email" className="form-input" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    {/* <label htmlFor="password" className="form-label">Password</label> */}
                    <input type="password" id="password" className="form-input" placeholder="Enter password" />
                </div>

                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default Login;