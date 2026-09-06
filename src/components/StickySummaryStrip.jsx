import React from 'react';
import { useDental } from '../context/DentalContext';

export default function StickySummaryStrip() {
  const { liveDMFT, liveWorstCPI, saveRecord } = useDental();

  return (
    <div className="summary-strip">
      <div className="grp">
        <div className="metric"><div className="n">{liveDMFT.D}</div><div className="l">Decayed</div></div>
        <div className="metric"><div className="n">{liveDMFT.M}</div><div className="l">Missing</div></div>
        <div className="metric"><div className="n">{liveDMFT.F}</div><div className="l">Filled</div></div>
        <div className="metric"><div className="n">{liveDMFT.DMFT}</div><div className="l">DMFT</div></div>
        <div className="metric"><div className="n">{liveWorstCPI}</div><div className="l">Worst CPI</div></div>
      </div>
      <button type="button" className="btn coral" onClick={saveRecord}>
        💾 Validate &amp; Save Record
      </button>
    </div>
  );
}
