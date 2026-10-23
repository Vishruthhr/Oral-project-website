import React, { useEffect } from 'react';
import { useDental } from '../context/DentalContext';

export default function NavigationRail() {
  const {
    activeSection,
    setActiveSection,
    liveDMFT,
    playClick,
    isNavOpen,
    setIsNavOpen
  } = useDental();

  const navItems = [
    { id: 'sec-general', num: '01', label: 'General Information' },
    { id: 'sec-dentition', num: '02', label: 'Dentition Chart' },
    { id: 'sec-perio', num: '03', label: 'Periodontal (CPI/LOA)' },
    { id: 'sec-other', num: '04', label: 'Other Findings' },
    { id: 'sec-records', num: '05', label: 'Saved Records' }
  ];

  // Close nav on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isNavOpen) {
        setIsNavOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavOpen, setIsNavOpen]);

  function handleNav(id) {
    playClick(700);
    setActiveSection(id);
    setIsNavOpen(false); // Close rail when item clicked
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      {/* Dimmed backdrop overlay */}
      <div
        className={`rail-backdrop ${isNavOpen ? 'visible' : ''}`}
        onClick={() => setIsNavOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Navigation Drawer */}
      <nav
        className={`rail ${isNavOpen ? 'open' : ''}`}
        aria-label="Main Navigation"
        aria-hidden={!isNavOpen}
      >
        <div className="rail-header">
          <div className="rail-brand">
            <div className="mark">
              <span className="mark-icon">🦷</span> Oral Health
            </div>
            <div className="tag">Clinical Workstation</div>
          </div>
          <button
            type="button"
            className="rail-close-btn"
            onClick={() => setIsNavOpen(false)}
            title="Close navigation"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <div className="rail-nav-list">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`tab-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNav(item.id);
                }
              }}
            >
              <span className="tab-num">{item.num}</span>
              <span className="label-text">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="rail-status">
          <div className="label">Current Subject DMFT</div>
          <div className="rail-dmft">
            <div><div className="n">{liveDMFT.D}</div><div className="l">D</div></div>
            <div><div className="n">{liveDMFT.M}</div><div className="l">M</div></div>
            <div><div className="n">{liveDMFT.F}</div><div className="l">F</div></div>
            <div><div className="n">{liveDMFT.DMFT}</div><div className="l">DMFT</div></div>
          </div>
        </div>
      </nav>
    </>
  );
}
