import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, clearSuccess } from '../../redux/slices/authSlice';
import './auth.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, user } = useSelector(state => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Clear errors after 3 seconds
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    // Clear success message after login
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="authContainer">
      <div className="authWrapper">
        <div className="authCard">
          <div className="authHeader">
            <h1>CanovaCRM</h1>
            <p>Sales Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="authForm">
            <h2>Login</h2>

            {error && (
              <div className="errorMessage">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7v5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="successMessage">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Login successful! Redirecting...
              </div>
            )}

            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' });
                  }
                }}
                className={validationErrors.email ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.email && (
                <span className="fieldError">{validationErrors.email}</span>
              )}
            </div>

            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <div className="passwordInput">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: '' });
                    }
                  }}
                  className={validationErrors.password ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="togglePassword"
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {validationErrors.password && (
                <span className="fieldError">{validationErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="submitBtn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loader"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <p className="authFooterNote">
              Note: Only registered administrators can access this system
            </p>
          </form>

          <div className="authFooter">
            <p>Demo Credentials:</p>
            <p className="demoInfo">Email: admin@example.com</p>
            <p className="demoInfo">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
