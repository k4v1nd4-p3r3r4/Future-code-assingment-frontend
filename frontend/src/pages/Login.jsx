import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  // Auto-focus username field on component mount
  useEffect(() => {
    const usernameField = document.querySelector('input[name="username"]');
    if (usernameField) usernameField.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (message?.type === 'danger') setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!form.username.trim() || !form.password.trim()) {
      setMessage({ type: 'danger', text: 'Please fill in all fields' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      await axios.post('/api/auth/login', form);
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Invalid username or password' 
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press for form submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">Product Manage App</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  style={{ textDecoration: 'none' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  style={{ textDecoration: 'none' }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className={`container mt-5 ${shake ? 'shake-animation' : ''}`} style={{ maxWidth: '400px' }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="mb-4 text-center text-primary">Welcome Back</h2>
            {message && (
              <div 
                className={`alert alert-${message.type} alert-dismissible fade show`} 
                role="alert"
              >
                {message.text}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMessage(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
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
                <div className="mt-2 text-end">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                className={`btn btn-primary w-100 py-2 fw-semibold ${loading ? 'pe-none' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </>
                )}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="mb-2">Don't have an account?</p>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate('/register')}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add some CSS for animations */}
      <style>{`
        .shake-animation {
          animation: shake 0.5s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .btn-link:hover {
          text-decoration: underline !important;
        }
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}