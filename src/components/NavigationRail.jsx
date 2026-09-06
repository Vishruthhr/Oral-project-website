import React from 'react';
import { useDental } from '../context/DentalContext';

export default function NavigationRail() {
  const { activeSection, setActiveSection, liveDMFT, playClick } = useDental();

  const navItems = [
    { id: 'sec-general', num: '01', label: 'General Information' },
    { id: 'sec-dentition', num: '02', label: 'Dentition Chart' },
    { id: 'sec-perio', num: '03', label: 'Periodontal (CPI/LOA)' },
    { id: 'sec-other', num: '04', label: 'Other Findings' },
    { id: 'sec-records', num: '05', label: 'Saved Records' }
  ];

  function handleNav(id) {
    playClick(700);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="rail" aria-label="Main Navigation">
      <div className="rail-brand">
        <div className="mark">Oral Health</div>
        <div className="tag">Clinical Workstation</div>
      </div>

      {navItems.map(item => (
        <div
          key={item.id}
          className={`tab-item ${activeSection === item.id ? 'active' : ''}`}
          onClick={() => handleNav(item.id)}
        >
          <span className="tab-num">{item.num}</span>
          <span className="label-text">{item.label}</span>
        </div>
      ))}

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
  );
}
