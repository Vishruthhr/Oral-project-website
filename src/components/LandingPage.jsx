import React, { useState } from 'react';
import { useDental } from '../context/DentalContext';
import NitteLogo from './NitteLogo';

export default function LandingPage({ onOpenLogin, onOpenSignup }) {
  const {
    isAuthenticated,
    navigateTo,
    loginOffline,
    setHelpDrawerOpen,
    currentExaminer,
    theme,
    toggleTheme
  } = useDental();

  // Landing page state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLandingMenuOpen, setIsLandingMenuOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const heroSlides = [
    {
      title: 'A B SHETTY MEMORIAL INSTITUTE OF DENTAL SCIENCES',
      subtitle: 'Department of Public Health Dentistry',
      tagline: 'Standard Digital Clinical Dental Charting & Epidemiological Survey Platform',
      badge: 'WHO Oral Health Surveys — 5th Edition',
      image: '/img/hero_dental_banner.jpg',
    },
    {
      title: 'CHAIRSIDE DENTAL CLINICAL WORKSTATION',
      subtitle: 'Precision Interactive Odontogram & Periodontal Charting',
      tagline: 'Rapid anatomical tooth keypad, dual dentition support, and automated DMFT scoring',
      badge: 'Paperless Clinical Fieldwork',
      image: '/img/hero_dental_banner.jpg',
    },
  ];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlideIndex];

  // Quick search suggestions
  const searchItems = [
    { cat: 'Clinical Criteria', title: 'WHO Dental Caries Scoring Codes (0 to 9)', action: () => { setIsSearchOpen(false); setHelpDrawerOpen(true); } },
    { cat: 'Clinical Criteria', title: 'CPI (Community Periodontal Index) Sextants', action: () => { setIsSearchOpen(false); setHelpDrawerOpen(true); } },
    { cat: 'Clinical Criteria', title: 'Dental Fluorosis Dean Index Guidelines', action: () => { setIsSearchOpen(false); setHelpDrawerOpen(true); } },
    { cat: 'Clinical Criteria', title: 'Trauma to Dentition (TDI) WHO Specifications', action: () => { setIsSearchOpen(false); setHelpDrawerOpen(true); } },
    { cat: 'Workstation', title: 'Launch Clinical Examination Chart', action: () => { setIsSearchOpen(false); navigateTo('workstation'); } },
    { cat: 'Field Camp', title: 'Offline Field Camp Mode (Zero Internet)', action: () => { setIsSearchOpen(false); const code = prompt('Enter Examiner Code / ID for offline session:', 'EX-01'); if (code) loginOffline(code.toUpperCase()); } },
  ];

  const filteredItems = searchQuery.trim()
    ? searchItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.cat.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchItems;

  return (
    <div className="landing-page-root">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="landing-topbar">
        {/* Top Left: NITTE ABSMIDS official logo */}
        <div className="landing-topbar-left">
          <NitteLogo
            variant="light"
            height={46}
            className="landing-nitte-logo"
            onClick={() => setCurrentSlideIndex(0)}
          />
        </div>

        {/* Middle of the bar: Website name & institutional department */}
        <div className="landing-topbar-middle">
          <div className="landing-bar-title-wrap">
            <span className="landing-bar-title">Oral Health Assessment Workstation</span>
            <span className="landing-bar-sub">Standard Digital Clinical Dental Charting Platform</span>
          </div>
        </div>

        {/* Right corner features: Blue admissions/workstation pill button, Search button, Hamburger menu */}
        <div className="landing-topbar-right">
          {isAuthenticated ? (
            <button
              type="button"
              className="landing-pill-btn"
              onClick={() => navigateTo('workstation')}
              title="Return to Active Clinical Workstation"
            >
              CLINICAL WORKSTATION ➔
            </button>
          ) : (
            <button
              type="button"
              className="landing-pill-btn"
              onClick={() => navigateTo('login')}
              title="Sign in or register for the clinical examination workstation"
            >
              ADMISSIONS 2026-27 / LOGIN
            </button>
          )}

          {/* Search Button */}
          <button
            type="button"
            className="landing-search-btn"
            onClick={() => setIsSearchOpen(true)}
            title="Search clinical criteria, codes, and workstation tools"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            className="landing-hamburger-btn"
            onClick={() => setIsLandingMenuOpen(true)}
            title="Open Menu"
            aria-label="Open Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION (MATCHING SCREENSHOT) ================= */}
      <section className="landing-hero-section">
        {/* Background Photo */}
        <div
          className="landing-hero-bg"
          style={{ backgroundImage: `url(${activeSlide.image})` }}
          aria-hidden="true"
        />
        <div className="landing-hero-overlay" />

        {/* Hero Content Overlay */}
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="badge-dot" />
            {activeSlide.badge}
          </div>

          <h1 className="landing-hero-title">{activeSlide.title}</h1>
          <h2 className="landing-hero-subtitle">{activeSlide.subtitle}</h2>
          <p className="landing-hero-desc">{activeSlide.tagline}</p>

          <div className="landing-hero-actions">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => {
                if (isAuthenticated) {
                  navigateTo('workstation');
                } else {
                  navigateTo('login');
                }
              }}
            >
              <span>🚀 Launch Clinical Workstation</span>
            </button>

            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => {
                const code = prompt('Enter Examiner Code / ID for Offline Field Session:', 'EX-01');
                if (code !== null && code.trim()) {
                  loginOffline(code.trim().toUpperCase());
                }
              }}
            >
              <span>⚡ Offline Field Camp Mode</span>
            </button>

            <button
              type="button"
              className="btn-hero-tertiary"
              onClick={() => setHelpDrawerOpen(true)}
            >
              <span>📖 WHO Codebook</span>
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows (< >) at Bottom Left (just like screenshot) */}
        <div className="landing-hero-carousel-nav">
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={handlePrevSlide}
            title="Previous Slide"
            aria-label="Previous Slide"
          >
            ❮
          </button>
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={handleNextSlide}
            title="Next Slide"
            aria-label="Next Slide"
          >
            ❯
          </button>
          <span className="carousel-slide-indicator">
            {currentSlideIndex + 1} / {heroSlides.length}
          </span>
        </div>
      </section>

      {/* ================= INSTITUTIONAL CAPABILITIES STRIP ================= */}
      <section className="landing-features-strip">
        <div className="features-container">
          <div className="feature-col">
            <div className="feature-icon">📋</div>
            <h3>WHO 5th Edition Standard</h3>
            <p>Comprehensive clinical assessment including Dentition Status, Periodontal CPI/LOA, Fluorosis, TDI, and Prosthetic needs.</p>
          </div>

          <div className="feature-col">
            <div className="feature-icon">🦷</div>
            <h3>Interactive Anatomical Arch</h3>
            <p>Touch-optimized anatomical dental arches supporting 32 permanent and 20 primary teeth with automated sequential progression.</p>
          </div>

          <div className="feature-col">
            <div className="feature-icon">📡</div>
            <h3>Offline Field Camp Ready</h3>
            <p>Conduct uninterrupted epidemiological surveys in remote rural camps with zero internet. Records synchronize automatically when online.</p>
          </div>

          <div className="feature-col">
            <div className="feature-icon">🔒</div>
            <h3>Examiner Identity & Audit</h3>
            <p>Multi-examiner authentication, photo verification, and separate examiner profiles linking surveys strictly by unique Examiner ID.</p>
          </div>
        </div>
      </section>

      {/* ================= INSTITUTIONAL FOOTER ================= */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand-col">
            <NitteLogo variant="light" height={40} />
            <p className="footer-dept">
              Department of Public Health Dentistry<br />
              A B Shetty Memorial Institute of Dental Sciences<br />
              NITTE (Deemed to be University)
            </p>
            <p className="footer-address">
              Medical Sciences Complex, Deralakatte, Mangaluru, Karnataka 575018, India
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Clinical Resources</h4>
            <ul>
              <li><button type="button" onClick={() => setHelpDrawerOpen(true)}>WHO 5th Edition Codebook</button></li>
              <li><button type="button" onClick={() => navigateTo('workstation')}>Chairside Assessment Chart</button></li>
              <li><button type="button" onClick={() => navigateTo('login')}>Examiner Registration & Sign In</button></li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const code = prompt('Enter Examiner Code / ID for offline camp mode:', 'EX-01');
                    if (code) loginOffline(code.toUpperCase());
                  }}
                >
                  Offline Field Mode
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-accreditation-col">
            <h4>Accreditation & Quality</h4>
            <div className="accreditation-pill">NAAC Accredited 'A+' Grade</div>
            <div className="accreditation-pill">NIRF Top Ranked Dental Institution</div>
            <div className="accreditation-pill">DCI Recognized</div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>© {new Date().getFullYear()} A B Shetty Memorial Institute of Dental Sciences, NITTE (Deemed to be University). All rights reserved.</div>
          <div>Standard Digital Clinical Dental Charting Platform</div>
        </div>
      </footer>

      {/* ================= SEARCH MODAL ================= */}
      {isSearchOpen && (
        <div className="landing-modal-backdrop" onClick={() => setIsSearchOpen(false)}>
          <div className="landing-search-dialog animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="search-dialog-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search clinical criteria, codes, workstation tools..."
                autoFocus
              />
              <button
                type="button"
                className="modal-close-icon"
                onClick={() => setIsSearchOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="search-dialog-results">
              {filteredItems.length === 0 ? (
                <div className="search-empty">No results found for "{searchQuery}"</div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={item.action}
                  >
                    <span className="result-cat">{item.cat}</span>
                    <span className="result-title">{item.title}</span>
                    <span className="result-arrow">➔</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SLIDE-OVER MENU DRAWER ================= */}
      {isLandingMenuOpen && (
        <div className="landing-menu-backdrop" onClick={() => setIsLandingMenuOpen(false)}>
          <aside className="landing-slide-menu animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="landing-menu-header">
              <NitteLogo variant="light" height={36} />
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsLandingMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="landing-menu-body">
              <div className="menu-group">
                <div className="menu-group-title">Clinical Navigation</div>
                <button
                  type="button"
                  className="menu-link-btn"
                  onClick={() => {
                    setIsLandingMenuOpen(false);
                    navigateTo(isAuthenticated ? 'workstation' : 'login');
                  }}
                >
                  🏥 {isAuthenticated ? 'Go to Workstation' : 'Sign In to Workstation'}
                </button>
                <button
                  type="button"
                  className="menu-link-btn"
                  onClick={() => {
                    setIsLandingMenuOpen(false);
                    const code = prompt('Enter Examiner Code / ID:', 'EX-01');
                    if (code) loginOffline(code.toUpperCase());
                  }}
                >
                  ⚡ Offline Field Camp Mode
                </button>
                <button
                  type="button"
                  className="menu-link-btn"
                  onClick={() => {
                    setIsLandingMenuOpen(false);
                    setHelpDrawerOpen(true);
                  }}
                >
                  📖 WHO Clinical Codebook
                </button>
              </div>

              <div className="menu-group">
                <div className="menu-group-title">Institution</div>
                <div className="menu-info-item">
                  <b>A B Shetty Memorial Institute of Dental Sciences</b>
                  <span>Established in 1985 • Mangaluru, India</span>
                </div>
                <div className="menu-info-item">
                  <b>Department of Public Health Dentistry</b>
                  <span>Chairside oral epidemiological survey system</span>
                </div>
              </div>

              <div className="menu-group">
                <button
                  type="button"
                  className="menu-link-btn"
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  🌓 Switch Theme ({theme === 'light' ? 'Dark' : 'Light'})
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
