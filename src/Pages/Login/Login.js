import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../Services/AuthService';
import Layout from '../../Components/Layout';
import './Login.css';

export default function LoginComponent() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!username || username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await AuthService.login(username.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout publicView>
      <div className="auth-page">
        <div className="card auth-card">
          <div className="auth-header">
            <div className="brand-badge">T</div>
            <div>
              <p className="auth-title">Welcome back</p>
              <p className="auth-subtitle">Sign in to your teacher account</p>
            </div>
          </div>

          <div className="auth-body">
            {error && <div className="auth-alert">{error}</div>}

            <form onSubmit={handleLogin} className="auth-form" noValidate>
              <div className="form-group">
                <label className="label" htmlFor="username">Username</label>
                <input
                  id="username"
                  className="input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="e.g. johndoe"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="password">Password</label>
                <div className="pw-wrap">
                  <input
                    id="password"
                    className="input pw-input"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPw(s => !s)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="auth-actions">
                <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <Link to="/signup" className="auth-link">Create account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
