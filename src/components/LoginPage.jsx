import React, { useState, useEffect, useRef } from 'react';
import { useDental } from '../context/DentalContext';

export default function LoginPage() {
  const { login, loginOffline, signUp, requestPasswordReset, theme, toggleTheme } = useDental();
  
  // Navigation view: 'login' | 'forgot' | 'signup'
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
  const [examinerName, setExaminerName] = useState('');
  const [examinerId, setExaminerId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupPhoto, setSignupPhoto] = useState(null); // base64 string
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

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

  // Stop camera tracks when camera is closed or view changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [view]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError('');
  }

  async function startCamera() {
    setCameraError('');
    setIsCameraActive(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError(err.message || 'Unable to access camera. You can upload a photo instead.');
      stopCamera();
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth || 320, video.videoHeight || 320, 360);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Center crop square
      const sx = ((video.videoWidth || size) - size) / 2;
      const sy = ((video.videoHeight || size) - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setSignupPhoto(dataUrl);
      stopCamera();
    } catch (err) {
      setCameraError('Could not capture photo from video feed.');
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSignupError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 360;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setSignupPhoto(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function removePhoto() {
    setSignupPhoto(null);
  }

  function resetSignupForm() {
    setExaminerName('');
    setExaminerId('');
    setMobileNumber('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setSignupPhoto(null);
    setSignupError('');
    setSignupSuccess(false);
    stopCamera();
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;
    if (!username.trim()) {
      setUsernameError('Email / Username is required');
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

    try {
      const res = await login(username, password);
      if (!res.success) setGeneralError(res.error);
    } catch (error) {
      setGeneralError(error.message || 'Unable to sign in. Please try again.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotInput.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }

    try {
      await requestPasswordReset(forgotInput);
      setForgotSuccess(true);
    } catch (error) {
      setForgotError(error.message || 'Unable to send a reset link.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess(false);

    const trimmedName = examinerName.trim();
    const trimmedId = examinerId.trim().toUpperCase();
    const trimmedMobile = mobileNumber.replace(/\D/g, '');
    const trimmedEmail = signupEmail.trim();

    if (!trimmedName) {
      setSignupError('Examiner Name is required.');
      return;
    }
    if (!trimmedId) {
      setSignupError('Examiner ID is required (e.g. EX-01).');
      return;
    }
    if (!trimmedMobile || trimmedMobile.length < 10) {
      setSignupError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!trimmedEmail) {
      setSignupError('Please enter an email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setSignupError('Please enter a valid email address (e.g., doctor@hospital.org).');
      return;
    }

    if (!signupPassword) {
      setSignupError('Please enter a password.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    try {
      const result = await signUp(trimmedEmail, signupPassword, {
        examinerName: trimmedName,
        examinerId: trimmedId,
        mobileNumber: trimmedMobile,
        email: trimmedEmail,
        photoUrl: signupPhoto,
      });

      if (!result.success) {
        setSignupError(result.error);
        return;
      }
      setSignupSuccess(true);
      resetSignupForm();
    } catch (error) {
      setSignupError(error.message || 'Unable to create your account.');
    }
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
              <span className="login-logo-icon" aria-hidden="true">OH</span>
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
                  <span>{generalError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
                <div className="field">
                  <label className="field-label" htmlFor="login_username">
                    Email / Examiner ID <span className="req">*</span>
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
                    placeholder="Enter your email or examiner ID"
                    autoComplete="email"
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
                      {showPassword ? 'Hide' : 'Show'}
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
                      resetSignupForm();
                    }}
                  >
                    Create a new account
                  </button>
                </div>

                <div className="login-divider">
                  <span>OR</span>
                </div>

                <div className="offline-login-box">
                  <div className="offline-login-info">
                    <div>
                      <div className="offline-title">Working in Field Camp or Offline?</div>
                      <div className="offline-desc">Work with zero internet. All records are saved securely on this device and can sync to cloud later.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-offline-mode"
                    onClick={() => {
                      const code = prompt('Enter Examiner Code / ID for this Offline Session:', 'EX-01');
                      if (code !== null && code.trim()) {
                        loginOffline(code.trim().toUpperCase());
                      }
                    }}
                  >
                    Work in Offline / Field Mode
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'signup' && (
            /* ================= SIGNUP VIEW ================= */
            <>
              <div className="login-welcome-section">
                <h2 className="login-welcome-title">Register Examiner Account</h2>
                <p className="login-welcome-sub">Create your clinical examiner profile to conduct dental surveys.</p>
              </div>

              {signupError && (
                <div className="login-error-alert" role="alert">
                  <span>{signupError}</span>
                </div>
              )}
              {signupSuccess && (
                <div className="login-success-alert" role="status">
                  <span>Examiner account created successfully! You can now use the workstation.</span>
                </div>
              )}

              {/* Live Camera Viewfinder Modal/Card */}
              {isCameraActive && (
                <div className="camera-viewfinder-card">
                  <div className="camera-header">
                    <span>📷 Position your face in view</span>
                    <button type="button" className="btn-close-camera" onClick={stopCamera}>✕</button>
                  </div>
                  <div className="camera-video-container">
                    <video ref={videoRef} className="camera-live-video" autoPlay playsInline />
                  </div>
                  <div className="camera-actions">
                    <button type="button" className="btn teal btn-snap-photo" onClick={capturePhoto}>
                      Capture Photo
                    </button>
                    <button type="button" className="btn btn-cancel-camera" onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="login-form" noValidate>
                {/* Photo Section (Upload or Take Photo) */}
                <div className="signup-photo-section">
                  <div className="signup-photo-avatar-wrap">
                    {signupPhoto ? (
                      <img src={signupPhoto} alt="Examiner avatar" className="signup-photo-avatar" />
                    ) : (
                      <div className="signup-photo-placeholder">
                        <span>👤</span>
                      </div>
                    )}
                  </div>

                  <div className="signup-photo-controls">
                    <div className="signup-photo-label-row">
                      <span className="field-label">Examiner Photo</span>
                      <span className="optional-tag">(Optional)</span>
                    </div>
                    <div className="signup-photo-btn-group">
                      <button
                        type="button"
                        className="btn-photo-action"
                        onClick={startCamera}
                        title="Take a live photo using your device camera"
                      >
                        📷 Take Photo
                      </button>
                      <button
                        type="button"
                        className="btn-photo-action"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload a photo from your device"
                      >
                        📁 Upload Photo
                      </button>
                      {signupPhoto && (
                        <button
                          type="button"
                          className="btn-photo-remove"
                          onClick={removePhoto}
                          title="Remove this photo"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    {cameraError && (
                      <div className="camera-err-hint">{cameraError}</div>
                    )}
                  </div>
                </div>

                <div className="grid2" style={{ gap: '12px' }}>
                  <div className="field">
                    <label className="field-label" htmlFor="signup_examiner_name">
                      Examiner Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="signup_examiner_name"
                      name="signup_examiner_name"
                      value={examinerName}
                      onChange={(e) => {
                        setExaminerName(e.target.value);
                        if (signupError) setSignupError('');
                      }}
                      placeholder="e.g. Dr. Jane Smith"
                      autoComplete="name"
                      autoFocus
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="signup_examiner_id">
                      Examiner ID <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="signup_examiner_id"
                      name="signup_examiner_id"
                      value={examinerId}
                      onChange={(e) => {
                        setExaminerId(e.target.value.toUpperCase());
                        if (signupError) setSignupError('');
                      }}
                      placeholder="e.g. EX-101"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="grid2" style={{ gap: '12px' }}>
                  <div className="field">
                    <label className="field-label" htmlFor="signup_mobile">
                      Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="signup_mobile"
                      name="signup_mobile"
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobileNumber(val);
                        if (signupError) setSignupError('');
                      }}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="signup_email">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      id="signup_email"
                      name="signup_email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (signupError) setSignupError('');
                      }}
                      placeholder="e.g. doctor@hospital.org"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="grid2" style={{ gap: '12px' }}>
                  <div className="field">
                    <label className="field-label" htmlFor="signup_password">
                      Password <span className="req">*</span>
                    </label>
                    <input
                      type="password"
                      id="signup_password"
                      name="signup_password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupError) setSignupError('');
                      }}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="signup_confirm_password">
                      Confirm Password <span className="req">*</span>
                    </label>
                    <input
                      type="password"
                      id="signup_confirm_password"
                      name="signup_confirm_password"
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        if (signupError) setSignupError('');
                      }}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="btn teal login-submit-btn">
                  Create Examiner Account
                </button>

                <div className="forgot-back-wrap">
                  <button
                    type="button"
                    className="back-to-login-btn"
                    onClick={() => {
                      setView('login');
                      resetSignupForm();
                    }}
                  >
                    ← Back to sign in
                  </button>
                </div>
              </form>

              <div className="login-footer-hint">
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Examiner profiles are securely stored separately in the database and linked by Examiner ID.
                </span>
              </div>
            </>
          )}

          {view === 'forgot' && (
            /* ================= FORGOT PASSWORD VIEW ================= */
            <>
              <div className="login-welcome-section">
                <h2 className="login-welcome-title">Reset your password</h2>
                <p className="login-welcome-sub">
                  Enter your registered email address below and we'll send you a password reset link.
                </p>
              </div>

              {forgotSuccess && (
                <div className="login-success-alert" role="status">
                  <span>If this account exists, a reset link has been sent.</span>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="login-form" noValidate>
                <div className="field">
                  <label className="field-label" htmlFor="forgot_input">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="forgot_input"
                    value={forgotInput}
                    onChange={(e) => {
                      setForgotInput(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    placeholder="Enter your email"
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

              <div className="login-footer-hint">
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Password resets are handled by your Supabase project.
                </span>
              </div>
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
