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
    <div className="shell">
      <NavigationRail />
      
      <main>
        <TopBar />

        <div className="content">
          <div className="demo-banner">
            <b>Chairside Clinical Examination:</b> Tap any tooth in the anatomical arch for rapid scoring with auto-advance sequence progression. All clinical records and drafts are securely persisted on-device.
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
  );
}
