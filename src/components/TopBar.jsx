import React from 'react';
import { useDental } from '../context/DentalContext';

export default function TopBar() {
  const {
    currentRecord,
    timerDisplay,
    theme,
    toggleTheme,
    setHelpDrawerOpen,
    logout
  } = useDental();

  const themeLabels = {
    light: 'Light Theme',
    dark: 'Dark Theme'
  };

  const displayName = currentRecord.patientName
    ? currentRecord.patientName
    : (currentRecord.participantId ? currentRecord.participantId : 'Unassigned');

  return (
    <header className="topbar">
      <div className="topbar-title-wrap">
        <h1>Oral Health Assessment Form</h1>
        <div className="sub">Standard Digital Clinical Dental Charting Platform</div>

        <div className="chairside-banner-pill">
          <span className="patient-badge">
            Patient: <b>{displayName}</b>
          </span>
          <span className="exam-timer">{timerDisplay}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="btn-topbar"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {themeLabels[theme] || 'Theme'}
        </button>

        <button
          type="button"
          className="help-btn"
          onClick={() => setHelpDrawerOpen(true)}
          title="Open Clinical Reference & Codebook"
        >
          📖 Help &amp; Codebook
        </button>

        <button
          type="button"
          className="btn-logout"
          onClick={logout}
          title="Sign out of workstation"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
}
