import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../../redux/authSlice";
import "./Login.css";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        // If already authenticated, redirect to home
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Clear any errors when component mounts
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div className="login-container">
            {/* Header */}
            <div className='header'>
                Canova<span>CRM</span>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    {/* <label htmlFor="email" className="form-label">Email</label> */}
                    <input 
                        type="email" 
                        id="email" 
                        className="form-input" 
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    {/* <label htmlFor="password" className="form-label">Password</label> */}
                    <input 
                        type="password" 
                        id="password" 
                        className="form-input" 
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Logging in..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Login;