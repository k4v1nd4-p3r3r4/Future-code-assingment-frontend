import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    username: '', 
    password: '',
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const nameField = document.querySelector('input[name="name"]');
    if (nameField) nameField.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'danger', text: 'Please fix the errors in the form' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await axios.post('/api/auth/register', {
        name: form.name,
        username: form.username,
        password: form.password
      });

      setMessage({ 
        type: 'success', 
        text: 'Registration successful! Redirecting to login...' 
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Debug: Log the full error object and response
      console.log('Registration error:', err);
      if (err.response) {
        console.log('Error response data:', err.response.data);
        console.log('Error response status:', err.response.status);
        console.log('Error response headers:', err.response.headers);
      }

      const errorMsg = err.response?.data?.message || 'Registration failed';
      setMessage({ type: 'danger', text: errorMsg });

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Product Manage App</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="container mt-5" style={{ maxWidth: '500px' }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="mb-4 text-center text-primary">Create Account</h2>
            
            {message && (
              <div className={`alert alert-${message.type} alert-dismissible fade show`}>
                {message.text}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMessage(null)}
                ></button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-badge-fill"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>
              
              {/* Username Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                  />
                </div>
                {errors.username && <div className="invalid-feedback d-block">{errors.username}</div>}
              </div>
              
              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    required
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
                  </button>
                </div>
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>
              
              {/* Confirm Password Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                )}
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Register
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="mb-2">Already have an account?</p>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate('/login')}
              >
                Sign in instead
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .btn-link:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}