import React from 'react';
import { useDental } from '../context/DentalContext';
import NitteLogo from './NitteLogo';

export default function LandingPage() {
  const {
    isAuthenticated,
    navigateTo,
    loginOffline,
    setHelpDrawerOpen,
    theme,
    toggleTheme
  } = useDental();

  const handleOpenWorkstation = () => {
    if (isAuthenticated) {
      navigateTo('workstation');
    } else {
      navigateTo('login');
    }
  };

  const handleOfflineMode = () => {
    const code = prompt('Enter Examiner Code / ID for Offline Field Session:', 'EX-01');
    if (code !== null && code.trim()) {
      loginOffline(code.trim().toUpperCase());
    }
  };

  // Comprehensive list of all website modules, features, and clinical options
  const websiteOptions = [
    {
      num: '01',
      title: 'General Information & Demographics',
      icon: '📋',
      badge: 'Demographics & Case Data',
      desc: 'Complete recording of patient demographics, identification codes, and baseline clinical parameters.',
      highlights: [
        'Automatic device examination date synchronization',
        'Auto-calculated patient age from Date of Birth',
        'Patient ID, Name, and 10-digit mobile number validation',
        'Village / Area, Sex, Education, Ethnic Group, Occupation, Habits'
      ]
    },
    {
      num: '02',
      title: 'Dentition Status & Odontogram',
      icon: '🦷',
      badge: 'WHO 1997 / 2013 Criteria',
      desc: 'Chairside interactive anatomical arch supporting 32 permanent and 20 primary teeth with touch-optimized keypad.',
      highlights: [
        'Dual scoring for Crown Status & Root Status per tooth',
        'Full WHO diagnostic codes: Sound (0/A), Caries (1/B), Filled (2-3/C-D), Missing (4-5/E), Sealant (6/F), Abutment (7/G), Unerupted (8), Trauma (T/T)',
        'Real-time automated DMFT (Decayed, Missing, Filled Teeth) computation',
        'Auto-advance sequential tooth navigation with audible acoustic feedback'
      ]
    },
    {
      num: '03',
      title: 'Periodontal Assessment (CPI & LOA)',
      icon: '🩺',
      badge: 'Periodontal Screening',
      desc: 'Systematic periodontal charting across six clinical sextants using the Community Periodontal Index.',
      highlights: [
        'CPI Sextant Probing: Healthy (0), Gingival Bleeding (1), Calculus (2), Shallow Pocket 4–5mm (3), Deep Pocket 6mm+ (4)',
        'Loss of Attachment (LOA) measurement: 0–3mm (0), 4–5mm (1), 6–8mm (2), 9–11mm (3), 12mm+ (4)',
        'Automated worst CPI score detection across all sextants',
        'Color-coded sextant indicators for instant chairside review'
      ]
    },
    {
      num: '04',
      title: 'Other Clinical Findings & Pathology',
      icon: '🔬',
      badge: 'Oral Pathology & Needs',
      desc: 'Standardized assessment of environmental, traumatic, mucosal conditions, and prosthetic needs.',
      highlights: [
        "Enamel Fluorosis scoring via Dean's Index (Normal to Severe)",
        'Dental Trauma (TDI) WHO classification (Enamel, Dentin, Pulp, Avulsion)',
        'Oral Mucosal Lesions (OML) recording with anatomical location and pathological condition',
        'Prosthetic Status & Prosthetic Needs assessment for Upper and Lower dental arches'
      ]
    },
    {
      num: '05',
      title: 'Saved Records & Epidemiological Data',
      icon: '📂',
      badge: 'Storage & Analytics',
      desc: 'Unified local and cloud database management for clinical examination surveys.',
      highlights: [
        'Real-time search and filter by Patient Name, Patient ID, or Examiner ID',
        'Instant retrieval of full examiner profiles by ID',
        'One-click multi-format data export: CSV, JSON, and printable clinical summaries',
        'Pending offline sync indicator with manual and automated cloud sync'
      ]
    },
    {
      num: '06',
      title: 'Field Camp Offline Operation',
      icon: '⚡',
      badge: 'Rural Outreach',
      desc: 'Purpose-built for uninterrupted epidemiological fieldwork in rural and remote locations with zero internet.',
      highlights: [
        '100% full application functionality without internet connectivity',
        'Secure local device encryption and IndexedDB/LocalStorage storage',
        'Automatic cloud synchronization when internet connection is restored',
        'Dedicated Offline Session Examiner login'
      ]
    },
    {
      num: '07',
      title: 'Examiner Identity & Verification',
      icon: '👤',
      badge: 'Identity & Security',
      desc: 'Accredited examiner management ensuring data integrity and survey accountability.',
      highlights: [
        'Unique Examiner ID assignment (e.g., EX-101) linking surveys strictly by ID',
        'Examiner registration with Name, Mobile Number, Email, and Photo',
        'Live device camera photo capture or photo file upload',
        'Modal examiner profile retrieval for verification across the workstation'
      ]
    }
  ];

  return (
    <div className="landing-page-wrapper">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="landing-navbar">
        {/* Top Left: NITTE ABSMIDS official logo */}
        <div className="landing-nav-left">
          <NitteLogo
            variant="light"
            height={44}
            className="landing-logo-btn"
            onClick={handleOpenWorkstation}
          />
        </div>

        {/* Middle of the bar: Website Name & Description */}
        <div className="landing-nav-middle">
          <h1 className="landing-platform-title">Oral Health Assessment Workstation</h1>
          <p className="landing-platform-sub">Standard Digital Clinical Dental Charting Platform</p>
        </div>

        {/* Right Corner: Workstation Access & Theme */}
        <div className="landing-nav-right">
          <button
            type="button"
            className="btn-enter-workstation"
            onClick={handleOpenWorkstation}
            title="Open Clinical Dental Workstation"
          >
            {isAuthenticated ? 'Open Workstation ➔' : 'Sign In / Register ➔'}
          </button>

          <button
            type="button"
            className="btn-landing-theme"
            onClick={toggleTheme}
            title="Toggle Light / Dark Theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION WITH DOCTOR PICTURE ================= */}
      <section className="landing-hero-showcase">
        <div className="landing-hero-backdrop">
          {/* Doctor picture */}
          <img
            src="/img/hero_dental_banner.jpg"
            alt="Doctor examining typodont dental model in clinical laboratory at A B Shetty Memorial Institute of Dental Sciences"
            className="doctor-hero-photo"
          />
          <div className="doctor-hero-gradient-overlay" />
        </div>

        <div className="landing-hero-inner">
          <div className="institutional-hero-tag">
            <span className="inst-dot" />
            NITTE (Deemed to be University) • A B Shetty Memorial Institute of Dental Sciences
          </div>

          <h1 className="hero-main-heading">
            Department of Public Health Dentistry
          </h1>
          <h2 className="hero-sub-heading">
            Oral Health Clinical Assessment &amp; Epidemiological Survey Platform
          </h2>

          <p className="hero-text-description">
            A standardized, WHO-compliant chairside digital dental examination platform engineered for dental colleges, clinical research, and community epidemiological field surveys. Features rapid anatomical tooth scoring, automated DMFT index calculation, CPI/LOA periodontal charting, and offline-first cloud synchronization.
          </p>

          <div className="hero-cta-button-group">
            <button
              type="button"
              className="btn-cta-primary"
              onClick={handleOpenWorkstation}
            >
              <span>🚀 Open Clinical Workstation</span>
            </button>

            <button
              type="button"
              className="btn-cta-secondary"
              onClick={handleOfflineMode}
            >
              <span>⚡ Offline Field Camp Mode</span>
            </button>

            <button
              type="button"
              className="btn-cta-outline"
              onClick={() => setHelpDrawerOpen(true)}
            >
              <span>📖 WHO Diagnostic Codebook</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= ALL WEBSITE OPTIONS & DESCRIPTIONS ================= */}
      <section className="landing-options-section" id="platform-options">
        <div className="options-section-header">
          <span className="section-eyebrow">Clinical Examination System</span>
          <h2 className="section-title">All Website Modules &amp; Capabilities</h2>
          <p className="section-lead">
            Comprehensive digital implementation of the World Health Organization (WHO) Oral Health Surveys — Basic Methods (5th Edition).
          </p>
        </div>

        <div className="options-cards-grid">
          {websiteOptions.map(opt => (
            <div key={opt.num} className="option-card">
              <div className="option-card-top">
                <span className="option-icon" aria-hidden="true">{opt.icon}</span>
                <span className="option-num">{opt.num}</span>
                <span className="option-badge">{opt.badge}</span>
              </div>

              <h3 className="option-title">{opt.title}</h3>
              <p className="option-description">{opt.desc}</p>

              <div className="option-features-list">
                <div className="features-label">Key Parameters:</div>
                <ul>
                  {opt.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Single Unified Call-to-Action Banner */}
        <div className="platform-cta-banner">
          <div className="cta-banner-text">
            <h3>Ready to Conduct Dental Health Surveys?</h3>
            <p>Launch the chairside charting interface, perform rapid anatomical tooth scoring, or synchronize field survey records.</p>
          </div>
          <div className="cta-banner-actions">
            <button
              type="button"
              className="btn-cta-primary"
              onClick={handleOpenWorkstation}
            >
              🚀 Launch Clinical Workstation
            </button>
            <button
              type="button"
              className="btn-cta-secondary"
              onClick={handleOfflineMode}
            >
              ⚡ Offline Field Camp
            </button>
          </div>
        </div>
      </section>

      {/* ================= INSTITUTIONAL FOOTER ================= */}
      <footer className="landing-bottom-footer">
        <div className="footer-container">
          <div className="footer-brand-info">
            <NitteLogo variant="light" height={42} />
            <p className="footer-inst-name">
              A B Shetty Memorial Institute of Dental Sciences<br />
              <b>NITTE (Deemed to be University)</b>
            </p>
            <p className="footer-dept-name">
              Department of Public Health Dentistry • Medical Sciences Complex, Deralakatte, Mangaluru, Karnataka 575018
            </p>
          </div>

          <div className="footer-quick-actions">
            <h4>Workstation Navigation</h4>
            <div className="footer-action-links">
              <button type="button" onClick={handleOpenWorkstation}>Launch Workstation</button>
              <button type="button" onClick={handleOfflineMode}>Offline Field Mode</button>
              <button type="button" onClick={() => setHelpDrawerOpen(true)}>Clinical Reference Codebook</button>
              <button type="button" onClick={handleOpenWorkstation}>Examiner Registration</button>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} A B Shetty Memorial Institute of Dental Sciences, NITTE (Deemed to be University). Standard Digital Clinical Dental Charting Platform.
        </div>
      </footer>
    </div>
  );
}
