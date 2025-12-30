import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError, clearSuccess } from '../../redux/slices/authSlice';
import './auth.css';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretKey: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    // Clear success message after signup
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        // Redirect to login after success
        navigate('/login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.adminSecretKey.trim()) {
      errors.adminSecretKey = 'Admin secret key is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Trim passwords before sending to API
    const trimmedData = {
      ...formData,
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      adminSecretKey: formData.adminSecretKey.trim()
    };
    dispatch(register(trimmedData));
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
            <h2>Sign Up</h2>

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
                Account created successfully! Redirecting to login...
              </div>
            )}

            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={validationErrors.firstName ? 'error' : ''}
                  disabled={loading}
                />
                {validationErrors.firstName && (
                  <span className="fieldError">{validationErrors.firstName}</span>
                )}
              </div>

              <div className="formGroup">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={validationErrors.lastName ? 'error' : ''}
                  disabled={loading}
                />
                {validationErrors.lastName && (
                  <span className="fieldError">{validationErrors.lastName}</span>
                )}
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
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
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="formGroup">
              <label htmlFor="confirmPassword">
                Confirm Password
                {formData.password && formData.confirmPassword && formData.password.trim() === formData.confirmPassword.trim() && (
                  <span className="passwordMatch"> ✓ Passwords match</span>
                )}
              </label>
              <div className="passwordInput">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={validationErrors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="togglePassword"
                  disabled={loading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="fieldError">{validationErrors.confirmPassword}</span>
              )}
            </div>

            <div className="formGroup">
              <label htmlFor="adminSecretKey">Admin Secret Key</label>
              <input
                id="adminSecretKey"
                type="password"
                name="adminSecretKey"
                placeholder="Enter admin secret key"
                value={formData.adminSecretKey}
                onChange={handleChange}
                className={validationErrors.adminSecretKey ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.adminSecretKey && (
                <span className="fieldError">{validationErrors.adminSecretKey}</span>
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
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            <p className="authLink">
              Already have an account?{' '}
              <Link to="/login">Login here</Link>
            </p>
          </form>

          <div className="authFooter">
            <p>Admin Registration Only</p>
            <p className="demoInfo">This form is only for creating the system administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
