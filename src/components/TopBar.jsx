import React from 'react';
import { useDental } from '../context/DentalContext';

export default function TopBar() {
  const {
    currentRecord,
    timerDisplay,
    theme,
    toggleTheme,
    audioEnabled,
    setAudioEnabled,
    setHelpDrawerOpen,
    playClick
  } = useDental();

  const themeLabels = {
    light: 'Light Theme',
    dark: 'Dark Theme'
  };

  return (
    <header className="topbar">
      <div className="topbar-title-wrap">
        <h1>Oral Health Assessment Form</h1>
        <div className="sub">Standard Digital Clinical Dental Charting Platform</div>

        <div className="chairside-banner-pill">
          <span className="patient-badge">
            Patient: {currentRecord.participantId ? <b>{currentRecord.participantId}</b> : <i>Unassigned</i>}
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
          {themeLabels[theme] || '🎨 Theme'}
        </button>

        <button
          type="button"
          className="help-btn"
          onClick={() => setHelpDrawerOpen(true)}
          title="Open Clinical Reference & Codebook"
        >
          📖 Help &amp; Codebook
        </button>
      </div>
    </header>
  );
}
