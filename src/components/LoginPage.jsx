import React, { useState, useEffect } from 'react';
import { useDental } from '../context/DentalContext';

export default function LoginPage() {
  const { login, signup, theme, toggleTheme } = useDental();
  
  // Navigation view: 'login' | 'signup' | 'forgot'
  const [view, setView] = useState('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Forgot password form state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Load remembered username on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dental_remember_user');
    const isRemembered = localStorage.getItem('dental_remember_me') === 'true';
    if (savedUser && isRemembered) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;
    if (!username.trim()) {
      setUsernameError('Username is required');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }
    if (hasError) return;

    if (rememberMe) {
      localStorage.setItem('dental_remember_user', username.trim());
      localStorage.setItem('dental_remember_me', 'true');
    } else {
      localStorage.removeItem('dental_remember_user');
      localStorage.setItem('dental_remember_me', 'false');
    }

    const res = login(username, password);
    if (!res.success) {
      setGeneralError(res.error);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupUsername.trim()) {
      setSignupError('Please enter a username.');
      return;
    }
    if (signupUsername.trim().length < 3) {
      setSignupError('Username must be at least 3 characters long.');
      return;
    }
    if (!signupPassword.trim()) {
      setSignupError('Please enter a password.');
      return;
    }
    if (signupPassword.trim().length < 4) {
      setSignupError('Password must be at least 4 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    const res = signup(signupUsername, signupPassword);
    if (!res.success) {
      setSignupError(res.error);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotInput.trim()) {
      setForgotError('Please enter your username or email address.');
      return;
    }

    setForgotSuccess(true);
  };

  return (
    <div className="login-wrapper">
      <div className="login-top-bar">
        <button
          type="button"
          className="btn-topbar"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          {/* Main Brand Header */}
          <div className="login-header">
            <div className="login-brand">
              <span className="login-logo-icon">🦷</span>
              <h1 className="login-title">Oral Health Clinical Workstation</h1>
            </div>
            <p className="login-tagline">Standard Digital Clinical Dental Charting Platform</p>
          </div>

          {view === 'login' && (
            /* ================= LOGIN VIEW ================= */
            <>
              <div className="login-welcome-section">
                <h2 className="login-welcome-title">Welcome back</h2>
                <p className="login-welcome-sub">Please sign in to continue</p>
              </div>

              {generalError && (
                <div className="login-error-alert" role="alert">
                  <span className="alert-icon">⚠️</span>
                  <span>{generalError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
                <div className="field">
                  <label className="field-label" htmlFor="login_username">
                    Username <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="login_username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError('');
                      if (generalError) setGeneralError('');
                    }}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className={usernameError || generalError ? 'input-error' : ''}
                    autoFocus
                  />
                  {usernameError && (
                    <span className="field-inline-error">{usernameError}</span>
                  )}
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="login_password">
                    Password <span className="req">*</span>
                  </label>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login_password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                        if (generalError) setGeneralError('');
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={passwordError || generalError ? 'input-error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈 Hide' : '👁️ Show'}
                    </button>
                  </div>
                  {passwordError && (
                    <span className="field-inline-error">{passwordError}</span>
                  )}
                </div>

                <div className="login-options-row">
                  <label className="remember-me-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={() => {
                      setView('forgot');
                      setForgotError('');
                      setForgotSuccess(false);
                      setForgotInput('');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="btn teal login-submit-btn">
                  Sign In to Workstation
                </button>

                <div className="forgot-back-wrap" style={{ marginTop: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    Don't have an account?{' '}
                  </span>
                  <button
                    type="button"
                    className="forgot-link-btn"
                    style={{ fontWeight: '600' }}
                    onClick={() => {
                      setView('signup');
                      setSignupError('');
                      setSignupUsername('');
                      setSignupPassword('');
                      setSignupConfirmPassword('');
                    }}
                  >
                    Create a new account
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'signup' && (
            /* ================= SIGNUP VIEW ================= */
            <>
              <div className="login-welcome-section">
                <h2 className="login-welcome-title">Create New Account</h2>
                <p className="login-welcome-sub">Sign up for workstation access</p>
              </div>

              {signupError && (
                <div className="login-error-alert" role="alert">
                  <span className="alert-icon">⚠️</span>
                  <span>{signupError}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="login-form" noValidate>
                <div className="field">
                  <label className="field-label" htmlFor="signup_username">
                    New Username <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="signup_username"
                    value={signupUsername}
                    onChange={(e) => {
                      setSignupUsername(e.target.value);
                      if (signupError) setSignupError('');
                    }}
                    placeholder="Choose a username"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="signup_password">
                    New Password <span className="req">*</span>
                  </label>
                  <div className="password-input-wrap">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      id="signup_password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupError) setSignupError('');
                      }}
                      placeholder="Choose a password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showSignupPassword ? '🙈 Hide' : '👁️ Show'}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="signup_confirm_password">
                    Confirm Password <span className="req">*</span>
                  </label>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signup_confirm_password"
                    value={signupConfirmPassword}
                    onChange={(e) => {
                      setSignupConfirmPassword(e.target.value);
                      if (signupError) setSignupError('');
                    }}
                    placeholder="Re-enter password to confirm"
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="btn teal login-submit-btn">
                  ✨ Create Account &amp; Sign In
                </button>

                <div className="forgot-back-wrap" style={{ marginTop: '16px', textAlign: 'center' }}>
                  <button
                    type="button"
                    className="back-to-login-btn"
                    onClick={() => {
                      setView('login');
                      setGeneralError('');
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'forgot' && (
            /* ================= FORGOT PASSWORD VIEW ================= */
            <>
              <div className="login-welcome-section">
                <h2 className="login-welcome-title">Reset your password</h2>
                <p className="login-welcome-sub">
                  Enter your registered username or email address below and we'll send you a password reset link.
                </p>
              </div>

              {forgotSuccess && (
                <div className="login-success-alert" role="status">
                  <span className="alert-icon">✓</span>
                  <span>If this account exists, a reset link has been sent.</span>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="login-form" noValidate>
                <div className="field">
                  <label className="field-label" htmlFor="forgot_input">
                    Username or Email <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="forgot_input"
                    value={forgotInput}
                    onChange={(e) => {
                      setForgotInput(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    placeholder="Enter username or email"
                    className={forgotError ? 'input-error' : ''}
                    autoFocus
                  />
                  {forgotError && (
                    <span className="field-inline-error">{forgotError}</span>
                  )}
                </div>

                <button type="submit" className="btn teal login-submit-btn">
                  Send reset link
                </button>

                <div className="forgot-back-wrap">
                  <button
                    type="button"
                    className="back-to-login-btn"
                    onClick={() => {
                      setView('login');
                      setGeneralError('');
                    }}
                  >
                    ← Back to sign in
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Card Footer */}
          <div className="login-card-footer">
            <p>© 2026 Oral Health Assessment Platform</p>
            <p>Need help? Contact your administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
