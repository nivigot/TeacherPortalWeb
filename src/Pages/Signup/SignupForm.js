import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { signupApi } from '../../Services/api';
import { validateLength, validateEmail } from '../../Validation/validation';
import './Signup.css';

export default function SignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched(t => ({ ...t, [e.target.name]: true }));

  const errors = useMemo(() => {
    const e = {};
    e.userName = validateLength(form.userName, 3, 30);
    e.firstName = validateLength(form.firstName, 2, 50);
    e.lastName = validateLength(form.lastName, 2, 50);
    e.email = validateEmail(form.email);
    e.password = form.password.length < 6 ? 'Use at least 6 characters.' : '';
    e.confirm = form.password !== form.confirm ? 'Passwords do not match.' : '';
    return e;
  }, [form]);

  const canSubmit = useMemo(
    () =>
      Object.values(errors).every(v => !v) &&
      Object.values(form).every(v => String(v).trim().length > 0),
    [errors, form]
  );

  const strength = useMemo(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^\w\s]/.test(p)) s++;
    return s;
  }, [form.password]);

  const submit = async (e) => {
    e.preventDefault();
    setTouched({
      userName: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      confirm: true,
    });
    if (!canSubmit) return;

    setLoading(true);
    setServerError('');

    try {
      const body = {
        userName: form.userName,
        email: form.email,
        passwordHash: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        students: [],
      };

      const res = await signupApi.post('/auth/signup', body);
      if (res.status === 200 || res.status === 201) {
        navigate('/login', { state: { justSignedUp: true } });
      } else {
        setServerError('Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err?.response?.status === 500) {
        setServerError('Email is already registered. Try a different email.');
      } else if (err?.response?.data) {
        setServerError(String(err.response.data));
      } else {
        setServerError('Could not sign up. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-wrap">
        <div className="card signup-card">
          <div className="signup-header">
            <div>
              <p className="signup-title">Create your teacher account</p>
              <p className="signup-subtitle">It's quick and free.</p>
            </div>
          </div>

          <div className="signup-body">
            {serverError && <div className="alert" role="alert" style={{ marginBottom: 16 }}>{serverError}</div>}

            <form onSubmit={submit} noValidate>
              <div className="two-col">
                <div className="form-group">
                  <label className="label" htmlFor="userName">Username</label>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    className={`input ${touched.userName && errors.userName ? 'input-error' : ''}`}
                    value={form.userName}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="username"
                  />
                  {touched.userName && errors.userName && <div className="inline-error">{errors.userName}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`input ${touched.email && errors.email ? 'input-error' : ''}`}
                    value={form.email}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="email"
                  />
                  {touched.email && errors.email && <div className="inline-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`input ${touched.firstName && errors.firstName ? 'input-error' : ''}`}
                    value={form.firstName}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="given-name"
                  />
                  {touched.firstName && errors.firstName && <div className="inline-error">{errors.firstName}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`input ${touched.lastName && errors.lastName ? 'input-error' : ''}`}
                    value={form.lastName}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="family-name"
                  />
                  {touched.lastName && errors.lastName && <div className="inline-error">{errors.lastName}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="password">Password</label>
                  <div className="pwd-field">
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      className={`input ${touched.password && errors.password ? 'input-error' : ''}`}
                      value={form.password}
                      onChange={onChange}
                      onBlur={onBlur}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowPwd(s => !s)}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <div className="pwd-meter" aria-hidden="true">
                    <div className={`bar s${strength}`} />
                  </div>
                  {touched.password && errors.password && <div className="inline-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="confirm">Confirm password</label>
                  <div className="pwd-field">
                    <input
                      id="confirm"
                      name="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className={`input ${touched.confirm && errors.confirm ? 'input-error' : ''}`}
                      value={form.confirm}
                      onChange={onChange}
                      onBlur={onBlur}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowConfirm(s => !s)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {touched.confirm && errors.confirm && <div className="inline-error">{errors.confirm}</div>}
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-primary" type="submit" disabled={loading || !canSubmit}>
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
                <span className="hint">
                  Already have an account? <Link to="/login">Log in</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
