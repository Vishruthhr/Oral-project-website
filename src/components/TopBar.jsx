import React from 'react';
import { useDental } from '../context/DentalContext';
import ExaminerInfoModal from './ExaminerInfoModal';

export default function TopBar() {
  const [viewingProfileId, setViewingProfileId] = React.useState(null);
  const {
    currentRecord,
    timerDisplay,
    theme,
    toggleTheme,
    setHelpDrawerOpen,
    logout,
    isOnline,
    isOfflineMode,
    pendingSyncCount,
    syncPending,
    toggleNav,
    currentExaminer
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
      <div className="topbar-left">
        <button
          type="button"
          className="nav-hamburger-btn"
          onClick={toggleNav}
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className="topbar-title-wrap">
        <h1>Oral Health Assessment Form</h1>
        <div className="sub">Standard Digital Clinical Dental Charting Platform</div>

        <div className="chairside-banner-pill">
          <span className="patient-badge">
            Patient: <b>{displayName}</b>
          </span>
          <span className="exam-timer">{timerDisplay}</span>
          <div className="network-status-indicator">
            {isOnline ? (
              <span className="net-pill online" title="Connected to Cloud">🟢 Online</span>
            ) : (
              <span className="net-pill offline" title="Working Offline — records saved locally on device">⚡ Offline</span>
            )}
            {pendingSyncCount > 0 && (
              <button
                type="button"
                className="sync-pill-btn"
                onClick={syncPending}
                title={`${pendingSyncCount} record(s) pending sync — click to sync with cloud`}
              >
                🔄 Sync ({pendingSyncCount})
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      <div className="topbar-actions">
        {currentExaminer && (
          <button
            type="button"
            className="btn-examiner-topbar-profile"
            onClick={() => setViewingProfileId(currentExaminer.examinerId)}
            title="View Active Examiner Profile"
          >
            {currentExaminer.photoUrl ? (
              <img src={currentExaminer.photoUrl} alt="" className="topbar-examiner-avatar" />
            ) : (
              <span className="topbar-examiner-icon">👤</span>
            )}
            <span className="topbar-examiner-label">
              <b>{currentExaminer.examinerId}</b>
              {currentExaminer.examinerName && (
                <span className="topbar-examiner-name"> ({typeof currentExaminer.examinerName === 'string' ? currentExaminer.examinerName.split(' ')[0] : currentExaminer.examinerName})</span>
              )}
            </span>
          </button>
        )}

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
      <ExaminerInfoModal
        examinerId={viewingProfileId}
        isOpen={Boolean(viewingProfileId)}
        onClose={() => setViewingProfileId(null)}
      />
    </header>
  );
}
