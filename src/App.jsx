class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Workstation Render Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '60px auto', background: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #EF4444', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontFamily: 'sans-serif' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ color: '#0F172A', margin: '0 0 10px', fontSize: '20px' }}>Clinical Workstation Error</h2>
          <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.5, margin: '0 0 20px' }}>
            An unexpected error occurred while rendering the clinical interface:
            <br />
            <code style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '8px' }}>
              {this.state.error?.message || 'Unknown error'}
            </code>
          </p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
          >
            Reload Workstation
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from 'react';
import { useDental } from './context/DentalContext';
import LoginPage from './components/LoginPage';
import NavigationRail from './components/NavigationRail';
import TopBar from './components/TopBar';
import GeneralInfoSection from './components/GeneralInfoSection';
import DentitionSection from './components/DentitionSection';
import PeriodontalSection from './components/PeriodontalSection';
import OtherFindingsSection from './components/OtherFindingsSection';
import SavedRecordsSection from './components/SavedRecordsSection';
import ToothKeypadModal from './components/ToothKeypadModal';
import CodebookDrawer from './components/CodebookDrawer';
import StickySummaryStrip from './components/StickySummaryStrip';
import Toast from './components/Toast';

export default function App() {
  const { isAuthenticated } = useDental();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  return (
    <ErrorBoundary>
      <div className="shell">
      <NavigationRail />
      
      <main>
        <TopBar />

        <div className="content">
          <div className="demo-banner">
            <b>Chairside Clinical Examination:</b> Tap any tooth in the anatomical arch for rapid scoring with auto-advance sequence progression. Clinical records sync to your Supabase account; drafts remain on this device.
          </div>

          <GeneralInfoSection />
          <DentitionSection />
          <PeriodontalSection />
          <OtherFindingsSection />
          <SavedRecordsSection />
        </div>

        <StickySummaryStrip />
      </main>

      <ToothKeypadModal />
      <CodebookDrawer />
      <Toast />
    </div>
    </ErrorBoundary>
  );
}
