import React, { useState } from 'react';
import { useDental } from '../context/DentalContext';
import { CLINICAL_CONSTANTS } from '../utils/clinicalConstants';
import { UpperOcclusalSvg, LowerOcclusalSvg } from './OcclusalArchSvg';

export default function PeriodontalSection() {
  const {
    currentRecord,
    updateField,
    updatePerioSite,
    updatePerioTooth,
    togglePerioPresent,
    togglePerioImplant,
    setPerioFurcation,
    fillPerioHealthy,
    clearPerio,
    setAllPerioPresent,
    livePerioStats,
    setHelpDrawerOpen,
    playClick
  } = useDental();

  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'cpi'
  const [showBopOverlay, setShowBopOverlay] = useState(true);
  const [showPlaqueOverlay, setShowPlaqueOverlay] = useState(true);
  const [showFurcations, setShowFurcations] = useState(true);
  const [showImplants, setShowImplants] = useState(true);
  const [highlightDeepPockets, setHighlightDeepPockets] = useState(false);

  const upperTeeth = CLINICAL_CONSTANTS.UPPER_TEETH; // [18..11, 21..28]
  const lowerTeeth = CLINICAL_CONSTANTS.LOWER_TEETH; // [48..41, 31..38]
  const perioData = currentRecord.perio || {};

  // Site ordering helpers
  const upperBuccalSites = ['db', 'b', 'mb'];
  const upperPalatalSites = ['dp', 'p', 'mp'];
  const lowerBuccalSites = ['db', 'b', 'mb'];
  const lowerLingualSites = ['dl', 'l', 'ml'];

  function handleCPIChange(index, val) {
    playClick();
    const updated = [...currentRecord.cpi];
    updated[index] = val;
    updateField('cpi', updated);
  }

  function handleLOAChange(index, val) {
    playClick();
    const updated = [...currentRecord.loa];
    updated[index] = val;
    updateField('loa', updated);
  }

  function getDepthColorClass(depth) {
    const d = Number(depth) || 0;
    if (d >= 6) return 'pd-severe';
    if (d >= 4) return 'pd-moderate';
    return 'pd-normal';
  }

  function getQuadrant(toothNum) {
    return Math.floor(toothNum / 10);
  }

  // Generate SVG probing curves across the 16 teeth arch (ViewBox: 0 0 790 162)
  function renderArchSvgOverlay(teethArray, isUpper, isBuccal) {
    const totalTeeth = teethArray.length; // 16
    const toothWidth = 790 / totalTeeth; // 49.375
    const cejY = isUpper ? 98 : 64;
    const scale = 3.2;

    const gmPoints = [];
    const pdPoints = [];
    const bopCircles = [];
    const plaqueSquares = [];

    teethArray.forEach((toothNum, tIdx) => {
      const tooth = perioData[toothNum] || {
        present: true,
        implant: false,
        bop: {},
        plaque: {},
        gm: {},
        pd: {}
      };

      if (!tooth.present) {
        return;
      }

      const sites = isUpper
        ? (isBuccal ? upperBuccalSites : upperPalatalSites)
        : (isBuccal ? lowerBuccalSites : lowerLingualSites);

      // 3 probe sites per tooth
      const xOffsets = [0.18, 0.5, 0.82];

      sites.forEach((siteKey, sIdx) => {
        const x = tIdx * toothWidth + xOffsets[sIdx] * toothWidth;
        const gmVal = Number(tooth.gm?.[siteKey]) || 0;
        const pdVal = Number(tooth.pd?.[siteKey]) || 2;

        const gmY = isUpper ? cejY - gmVal * scale : cejY + gmVal * scale;
        const pocketY = isUpper ? gmY - pdVal * scale : gmY + pdVal * scale;

        gmPoints.push({ x, y: gmY, toothNum, siteKey });
        pdPoints.push({ x, y: pocketY, toothNum, siteKey });

        if (showBopOverlay && tooth.bop?.[siteKey]) {
          bopCircles.push({ x, y: pocketY, key: `${toothNum}_${siteKey}` });
        }
        if (showPlaqueOverlay && tooth.plaque?.[siteKey]) {
          plaqueSquares.push({ x, y: gmY, key: `${toothNum}_${siteKey}` });
        }
      });
    });

    // Build SVG paths for pocket area, GM line, and PD line
    let pocketAreaPath = '';
    let gmPath = '';
    let pdPath = '';

    if (gmPoints.length > 0 && pdPoints.length > 0) {
      gmPath = 'M ' + gmPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ');
      pdPath = 'M ' + pdPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ');

      const reversedPd = [...pdPoints].reverse();
      pocketAreaPath =
        'M ' +
        gmPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ') +
        ' L ' +
        reversedPd.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ') +
        ' Z';
    }

    return (
      <svg viewBox="0 0 790 162" width="100%" height="100%" className="perio-arch-svg-overlay">
        {/* Shaded Pocket Volume Area */}
        {pocketAreaPath && <path d={pocketAreaPath} className="perio-pocket-area" />}

        {/* Gingival Margin Contour Line (Blue) */}
        {gmPath && <path d={gmPath} className="perio-gm-line" />}

        {/* Probing Depth Baseline Curve (Medical Red) */}
        {pdPath && <path d={pdPath} className="perio-pd-line" />}

        {/* BOP Red Dot Indicators */}
        {bopCircles.map(c => (
          <circle key={c.key} cx={c.x} cy={c.y} r="3.6" className="graph-bop-circle" />
        ))}

        {/* Plaque Blue Squares */}
        {plaqueSquares.map(s => (
          <rect key={s.key} x={s.x - 3} y={s.y - 3} width="6" height="6" className="graph-pi-rect" />
        ))}

        {/* Missing Teeth Visual Overlay Masks */}
        {teethArray.map((toothNum, tIdx) => {
          const tooth = perioData[toothNum];
          if (tooth && !tooth.present) {
            const x = tIdx * toothWidth;
            return (
              <g key={`missing_${toothNum}`} className="missing-tooth-mask">
                <rect x={x + 2} y="4" width={toothWidth - 4} height="154" rx="4" className="missing-rect" />
                <line x1={x + 6} y1="10" x2={x + toothWidth - 6} y2="152" className="missing-cross" />
                <line x1={x + toothWidth - 6} y1="10" x2={x + 6} y2="152" className="missing-cross" />
              </g>
            );
          }
          return null;
        })}
      </svg>
    );
  }

  // Render Tooth Column in the Data Grid
  function renderToothGridCol(toothNum, isUpper) {
    const tooth = perioData[toothNum] || {
      present: true,
      implant: false,
      mobility: 0,
      furcation: { b: 0, dp: 0, mp: 0, l: 0 },
      bop: {},
      plaque: {},
      gm: {},
      pd: {}
    };

    const isMolar = [18, 17, 16, 26, 27, 28, 48, 47, 46, 36, 37, 38].includes(toothNum);
    const buccalSites = isUpper ? upperBuccalSites : lowerBuccalSites;
    const innerSites = isUpper ? upperPalatalSites : lowerLingualSites;

    return (
      <div
        key={toothNum}
        className={`perio-tooth-col ${!tooth.present ? 'tooth-missing' : ''} ${tooth.implant ? 'is-implant' : ''}`}
        id={`perio-col-${toothNum}`}
      >
        {/* Row: Tooth Header */}
        <div className="perio-cell cell-tooth-header">
          <button
            type="button"
            className={`tooth-num-btn ${!tooth.present ? 'missing' : ''}`}
            onClick={() => togglePerioPresent(toothNum)}
            title={`Tooth #${toothNum} — Click to toggle Present/Missing`}
          >
            {toothNum}
          </button>
        </div>

        {/* Row: Implant */}
        <div className="perio-cell cell-implant">
          <button
            type="button"
            className={`implant-pill-btn ${tooth.implant ? 'active' : ''}`}
            disabled={!tooth.present}
            onClick={() => togglePerioImplant(toothNum)}
            title={`Tooth #${toothNum} — Toggle Implant Fixture`}
          >
            {tooth.implant ? '🔩 Imp' : '—'}
          </button>
        </div>

        {/* Row: Mobility */}
        <div className="perio-cell cell-mobility">
          <select
            className="perio-select-micro"
            value={tooth.mobility || 0}
            disabled={!tooth.present}
            onChange={e => updatePerioTooth(toothNum, 'mobility', Number(e.target.value))}
            title={`Tooth #${toothNum} Mobility Degree`}
          >
            <option value={0}>0</option>
            <option value={1}>I</option>
            <option value={2}>II</option>
            <option value={3}>III</option>
          </select>
        </div>

        {/* Row: Furcation Top */}
        <div className="perio-cell cell-furcation">
          {isMolar && tooth.present && showFurcations ? (
            <select
              className={`furc-select ${(isUpper ? tooth.furcation?.b : tooth.furcation?.l) > 0 ? 'active' : ''}`}
              value={isUpper ? (tooth.furcation?.b || 0) : (tooth.furcation?.l || 0)}
              onChange={e => setPerioFurcation(toothNum, isUpper ? 'b' : 'l', Number(e.target.value))}
              title={`${isUpper ? 'Buccal' : 'Lingual'} Furcation Grade (0–3)`}
            >
              <option value={0}>0</option>
              <option value={1}>▲ 1</option>
              <option value={2}>▲ 2</option>
              <option value={3}>▲ 3</option>
            </select>
          ) : (
            <span className="cell-dash">—</span>
          )}
        </div>

        {/* Row: BOP Top */}
        <div className="perio-cell cell-dots">
          <div className="perio-dots-triple">
            {(isUpper ? buccalSites : innerSites).map(s => (
              <button
                type="button"
                key={`bop-top-${s}`}
                className={`dot-btn bop-dot ${tooth.bop[s] ? 'active' : ''}`}
                disabled={!tooth.present}
                onClick={() => updatePerioSite(toothNum, 'bop', s, !tooth.bop[s])}
                title={`BOP (${s.toUpperCase()}) — Click to toggle`}
              />
            ))}
          </div>
        </div>

        {/* Row: Plaque Top */}
        <div className="perio-cell cell-dots">
          <div className="perio-dots-triple">
            {(isUpper ? buccalSites : innerSites).map(s => (
              <button
                type="button"
                key={`plaque-top-${s}`}
                className={`dot-btn plaque-dot ${tooth.plaque[s] ? 'active' : ''}`}
                disabled={!tooth.present}
                onClick={() => updatePerioSite(toothNum, 'plaque', s, !tooth.plaque[s])}
                title={`Plaque (${s.toUpperCase()}) — Click to toggle`}
              />
            ))}
          </div>
        </div>

        {/* Row: Gingival Margin Top */}
        <div className="perio-cell cell-inputs">
          <div className="perio-inputs-triple">
            {(isUpper ? buccalSites : innerSites).map(s => (
              <input
                key={`gm-top-${s}`}
                type="number"
                min="-10"
                max="20"
                className="perio-num-input gm-input"
                disabled={!tooth.present}
                value={tooth.gm[s] !== undefined ? tooth.gm[s] : 0}
                onChange={e => updatePerioSite(toothNum, 'gm', s, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
              />
            ))}
          </div>
        </div>

        {/* Row: Probing Depth Top */}
        <div className="perio-cell cell-inputs">
          <div className="perio-inputs-triple">
            {(isUpper ? buccalSites : innerSites).map(s => {
              const val = tooth.pd[s] !== undefined ? tooth.pd[s] : 2;
              const colorCls = getDepthColorClass(val);
              const isDeepAlert = highlightDeepPockets && Number(val) >= 6;
              return (
                <input
                  key={`pd-top-${s}`}
                  type="number"
                  min="0"
                  max="20"
                  className={`perio-num-input pd-input ${colorCls} ${isDeepAlert ? 'deep-highlight' : ''}`}
                  disabled={!tooth.present}
                  value={val}
                  onChange={e => updatePerioSite(toothNum, 'pd', s, e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="2"
                />
              );
            })}
          </div>
        </div>

        {/* Row: Attachment Level (CAL) Top */}
        <div className="perio-cell cell-inputs cell-cal">
          <div className="perio-inputs-triple">
            {(isUpper ? buccalSites : innerSites).map(s => {
              const pd = Number(tooth.pd[s]) || 0;
              const gm = Number(tooth.gm[s]) || 0;
              const cal = pd + gm;
              return (
                <span key={`cal-top-${s}`} className="cal-val-display" title={`CAL = PD (${pd}) + GM (${gm})`}>
                  {tooth.present ? cal : '—'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Row: Attachment Level (CAL) Bottom */}
        <div className="perio-cell cell-inputs cell-cal" style={{ borderTop: '2px solid var(--line)' }}>
          <div className="perio-inputs-triple">
            {(isUpper ? innerSites : buccalSites).map(s => {
              const pd = Number(tooth.pd[s]) || 0;
              const gm = Number(tooth.gm[s]) || 0;
              const cal = pd + gm;
              return (
                <span key={`cal-bot-${s}`} className="cal-val-display" title={`CAL = PD (${pd}) + GM (${gm})`}>
                  {tooth.present ? cal : '—'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Row: Probing Depth Bottom */}
        <div className="perio-cell cell-inputs">
          <div className="perio-inputs-triple">
            {(isUpper ? innerSites : buccalSites).map(s => {
              const val = tooth.pd[s] !== undefined ? tooth.pd[s] : 2;
              const colorCls = getDepthColorClass(val);
              const isDeepAlert = highlightDeepPockets && Number(val) >= 6;
              return (
                <input
                  key={`pd-bot-${s}`}
                  type="number"
                  min="0"
                  max="20"
                  className={`perio-num-input pd-input ${colorCls} ${isDeepAlert ? 'deep-highlight' : ''}`}
                  disabled={!tooth.present}
                  value={val}
                  onChange={e => updatePerioSite(toothNum, 'pd', s, e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="2"
                />
              );
            })}
          </div>
        </div>

        {/* Row: Gingival Margin Bottom */}
        <div className="perio-cell cell-inputs">
          <div className="perio-inputs-triple">
            {(isUpper ? innerSites : buccalSites).map(s => (
              <input
                key={`gm-bot-${s}`}
                type="number"
                min="-10"
                max="20"
                className="perio-num-input gm-input"
                disabled={!tooth.present}
                value={tooth.gm[s] !== undefined ? tooth.gm[s] : 0}
                onChange={e => updatePerioSite(toothNum, 'gm', s, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
              />
            ))}
          </div>
        </div>

        {/* Row: Plaque Bottom */}
        <div className="perio-cell cell-dots">
          <div className="perio-dots-triple">
            {(isUpper ? innerSites : buccalSites).map(s => (
              <button
                type="button"
                key={`plaque-bot-${s}`}
                className={`dot-btn plaque-dot ${tooth.plaque[s] ? 'active' : ''}`}
                disabled={!tooth.present}
                onClick={() => updatePerioSite(toothNum, 'plaque', s, !tooth.plaque[s])}
                title={`Plaque (${s.toUpperCase()})`}
              />
            ))}
          </div>
        </div>

        {/* Row: BOP Bottom */}
        <div className="perio-cell cell-dots">
          <div className="perio-dots-triple">
            {(isUpper ? innerSites : buccalSites).map(s => (
              <button
                type="button"
                key={`bop-bot-${s}`}
                className={`dot-btn bop-dot ${tooth.bop[s] ? 'active' : ''}`}
                disabled={!tooth.present}
                onClick={() => updatePerioSite(toothNum, 'bop', s, !tooth.bop[s])}
                title={`BOP (${s.toUpperCase()})`}
              />
            ))}
          </div>
        </div>

        {/* Row: Furcation Bottom */}
        <div className="perio-cell cell-furcation">
          {isMolar && tooth.present && showFurcations ? (
            <select
              className={`furc-select ${(isUpper ? tooth.furcation?.dp : tooth.furcation?.b) > 0 ? 'active' : ''}`}
              value={isUpper ? (tooth.furcation?.dp || 0) : (tooth.furcation?.b || 0)}
              onChange={e => setPerioFurcation(toothNum, isUpper ? 'dp' : 'b', Number(e.target.value))}
              title={`${isUpper ? 'Palatal' : 'Buccal'} Furcation Grade`}
            >
              <option value={0}>0</option>
              <option value={1}>▲ 1</option>
              <option value={2}>▲ 2</option>
              <option value={3}>▲ 3</option>
            </select>
          ) : (
            <span className="cell-dash">—</span>
          )}
        </div>
      </div>
    );
  }

  function renderRowLabels(isUpper) {
    return (
      <div className="perio-labels-col">
        <div className="perio-label-cell"><span>Tooth</span></div>
        <div className="perio-label-cell"><span>Implant</span></div>
        <div className="perio-label-cell"><span>Mobility</span></div>
        <div className="perio-label-cell buccal-tag"><span>Furcation ({isUpper ? 'B' : 'L'})</span></div>
        <div className="perio-label-cell buccal-tag"><span>BOP ({isUpper ? 'Buccal' : 'Lingual'})</span></div>
        <div className="perio-label-cell buccal-tag"><span>Plaque ({isUpper ? 'Buccal' : 'Lingual'})</span></div>
        <div className="perio-label-cell buccal-tag"><span>Gingival Margin (GM)</span></div>
        <div className="perio-label-cell buccal-tag"><span>Probing Depth (PD)</span></div>
        <div className="perio-label-cell buccal-tag"><span>Attachment (CAL)</span></div>

        <div className="perio-label-cell lingual-tag" style={{ borderTop: '2px solid var(--line)' }}><span>Attachment (CAL)</span></div>
        <div className="perio-label-cell lingual-tag"><span>Probing Depth (PD)</span></div>
        <div className="perio-label-cell lingual-tag"><span>Gingival Margin (GM)</span></div>
        <div className="perio-label-cell lingual-tag"><span>Plaque ({isUpper ? 'Palatal' : 'Buccal'})</span></div>
        <div className="perio-label-cell lingual-tag"><span>BOP ({isUpper ? 'Palatal' : 'Buccal'})</span></div>
        <div className="perio-label-cell lingual-tag"><span>Furcation ({isUpper ? 'P' : 'B'})</span></div>
      </div>
    );
  }

  // Render Tooth Anatomical Image Chart with SVG Probing Curves Overlay and Titanium Implant Markers
  function renderAnatomicalImageChart(teethArray, isUpper, isFirstView, bgImageSrc) {
    const isBuccal = isUpper ? isFirstView : !isFirstView;
    const aspectLetter = isUpper ? (isFirstView ? 'b' : 'p') : (isFirstView ? 'l' : 'b');

    return (
      <div className="perio-anatomical-arch-card">
        <div className="arch-strip-header">
          <span className="strip-title">
            {isUpper ? (isFirstView ? 'Upper Jaw — Buccal View' : 'Upper Jaw — Palatal View') : (isFirstView ? 'Lower Jaw — Lingual View' : 'Lower Jaw — Buccal View')}
          </span>
          <span className="strip-sub">6-Point Probing Depth &amp; Gingival Margin Curve Overlay</span>
        </div>

        <div className="perio-chart-illustration-box">
          {/* Background High-Definition Dental Arch Anatomical Illustration */}
          <img
            src={bgImageSrc}
            alt="Anatomical dental arch illustration"
            className="perio-background-teeth-img"
          />

          {/* Dynamic SVG Probing Depth Curve & Pocket Shaded Area Overlay */}
          <div className="perio-svg-curves-layer">
            {renderArchSvgOverlay(teethArray, isUpper, isBuccal)}
          </div>

          {/* Titanium Implant Fixture Overlays */}
          {showImplants && teethArray.map((toothNum, tIdx) => {
            const tooth = perioData[toothNum];
            if (tooth && tooth.present && tooth.implant) {
              const quad = getQuadrant(toothNum);
              const implantSrc = `/img/implants/${quad}/${toothNum}${aspectLetter}.png`;
              const toothWidthPercent = 100 / teethArray.length;
              const leftPercent = tIdx * toothWidthPercent;

              return (
                <img
                  key={`imp_${toothNum}_${aspectLetter}`}
                  src={implantSrc}
                  alt={`Implant ${toothNum}`}
                  className="perio-implant-img-overlay"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${toothWidthPercent}%`
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="card perio-master-card" id="sec-perio">
      <div className="perio-header-top">
        <div>
          <h2>
            <span className="sec-num">03</span> Periodontal Status Chart
            <button
              type="button"
              className="help-ico"
              onClick={() => setHelpDrawerOpen(true)}
              title="View Periodontal Probing Criteria"
            >
              i
            </button>
          </h2>
          <div className="card-sub">
            University Periodontal Clinical Charting &amp; Assessment with Anatomical Odontogram Images (Probing Depths, Gingival Margin, Bleeding on Probing, Plaque Index &amp; Furcations)
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="perio-mode-switcher">
          <button
            type="button"
            className={`mode-btn ${activeTab === 'chart' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveTab('chart'); }}
          >
            📊 6-Point Periodontal Chart
          </button>
          <button
            type="button"
            className={`mode-btn ${activeTab === 'cpi' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveTab('cpi'); }}
          >
            📋 6-Sextant CPI/LOA Screening
          </button>
        </div>
      </div>

      {activeTab === 'chart' ? (
        <>
          {/* Control & Action Bar */}
          <div className="perio-control-bar">
            <div className="control-btn-group">
              <button
                type="button"
                className="btn-perio-tool"
                onClick={fillPerioHealthy}
                title="Fill all 32 teeth with healthy baseline values (PD 2mm, GM 0mm, BOP 0%)"
              >
                ✓ Fill Healthy (2mm)
              </button>
              <button
                type="button"
                className="btn-perio-tool"
                onClick={() => setAllPerioPresent(true)}
                title="Set all teeth as Present"
              >
                🦷 All Present
              </button>
              <button
                type="button"
                className="btn-perio-tool"
                onClick={() => setAllPerioPresent(false)}
                title="Set all teeth as Missing"
              >
                ✕ All Missing
              </button>
              <button
                type="button"
                className="btn-perio-tool danger"
                onClick={clearPerio}
                title="Clear all periodontal measurements"
              >
                ↺ Clear Chart
              </button>
            </div>

            {/* Display & Filter Toggles */}
            <div className="perio-toggles-row">
              <button
                type="button"
                className={`toggle-pill ${showBopOverlay ? 'active' : ''}`}
                onClick={() => setShowBopOverlay(!showBopOverlay)}
              >
                🔴 PD / BOP
              </button>
              <button
                type="button"
                className={`toggle-pill ${highlightDeepPockets ? 'active' : ''}`}
                onClick={() => setHighlightDeepPockets(!highlightDeepPockets)}
              >
                ⚠️ Pockets ≥ 6mm
              </button>
              <button
                type="button"
                className={`toggle-pill ${showPlaqueOverlay ? 'active' : ''}`}
                onClick={() => setShowPlaqueOverlay(!showPlaqueOverlay)}
              >
                🔵 Plaque (PI)
              </button>
              <button
                type="button"
                className={`toggle-pill ${showFurcations ? 'active' : ''}`}
                onClick={() => setShowFurcations(!showFurcations)}
              >
                ▲ Furcations
              </button>
              <button
                type="button"
                className={`toggle-pill ${showImplants ? 'active' : ''}`}
                onClick={() => setShowImplants(!showImplants)}
              >
                🔩 Implants
              </button>
            </div>
          </div>

          {/* Live Risk & Indices Dashboard */}
          <div className="perio-indices-dashboard">
            <div className="index-stat-card">
              <div className="stat-num">{livePerioStats.plaquePercent}%</div>
              <div className="stat-label">Plaque Index (PI)</div>
              <span className={`status-pill ${livePerioStats.plaquePercent <= 20 ? 'pill-good' : 'pill-alert'}`}>
                {livePerioStats.plaquePercent <= 20 ? 'Good (≤ 20%)' : 'Elevated'}
              </span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num">{livePerioStats.bopPercent}%</div>
              <div className="stat-label">Bleeding on Probing (BOP)</div>
              <span className={`status-pill ${livePerioStats.bopPercent <= 20 ? 'pill-good' : 'pill-alert'}`}>
                {livePerioStats.bopPercent <= 20 ? 'Stable (≤ 20%)' : 'Inflamed'}
              </span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num">{livePerioStats.meanPD} <span className="stat-unit">mm</span></div>
              <div className="stat-label">Mean Probing Depth</div>
              <span className="status-pill pill-info">Avg. Pocket Depth</span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num">{livePerioStats.meanCAL} <span className="stat-unit">mm</span></div>
              <div className="stat-label">Mean Attachment Level</div>
              <span className="status-pill pill-info">Avg. CAL Loss</span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num text-warning">{livePerioStats.pockets4mm} <span className="stat-pct">({livePerioStats.pockets4mmPercent}%)</span></div>
              <div className="stat-label">Pockets 4–5 mm</div>
              <span className="status-pill pill-warning">Moderate</span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num text-danger">{livePerioStats.pockets6mm} <span className="stat-pct">({livePerioStats.pockets6mmPercent}%)</span></div>
              <div className="stat-label">Deep Pockets ≥ 6 mm</div>
              <span className="status-pill pill-alert">Severe Risk</span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num">{livePerioStats.furcationsCount}</div>
              <div className="stat-label">Furcations (Grades 1–3)</div>
              <span className="status-pill pill-info">Multi-rooted</span>
            </div>

            <div className="index-stat-card">
              <div className="stat-num">{livePerioStats.teethPresent}/32</div>
              <div className="stat-label">Teeth Present</div>
              <span className="status-pill pill-info">Implants: {livePerioStats.implantsCount}</span>
            </div>
          </div>

          {/* ==================== UPPER JAW (MAXILLA) CHART ==================== */}
          <div className="perio-jaw-section">
            <div className="jaw-heading">
              <span className="jaw-badge">Upper Jaw (Maxilla)</span>
              <span className="jaw-sub">Quadrant 1 (18 → 11) &amp; Quadrant 2 (21 → 28)</span>
            </div>

            {/* Upper Buccal Anatomical Chart Image Strip */}
            {renderAnatomicalImageChart(upperTeeth, true, true, '/img/jpg/ok-teeth-01.jpg')}

            {/* Upper Occlusal Arch Interactive Diagram */}
            <div className="perio-occlusal-strip">
              <UpperOcclusalSvg perioData={perioData} togglePerioPresent={togglePerioPresent} />
            </div>

            {/* Upper Palatal Anatomical Chart Image Strip */}
            {renderAnatomicalImageChart(upperTeeth, true, false, '/img/jpg/ok-teeth-02.jpg')}

            {/* Upper Jaw Numeric Probing Data Table */}
            <div className="perio-table-scroll-container">
              <div className="perio-chart-table">
                {renderRowLabels(true)}
                <div className="perio-teeth-stream">
                  {upperTeeth.map(t => renderToothGridCol(t, true))}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== LOWER JAW (MANDIBLE) CHART ==================== */}
          <div className="perio-jaw-section" style={{ marginTop: '32px' }}>
            <div className="jaw-heading">
              <span className="jaw-badge">Lower Jaw (Mandible)</span>
              <span className="jaw-sub">Quadrant 4 (48 → 41) &amp; Quadrant 3 (31 → 38)</span>
            </div>

            {/* Lower Lingual Anatomical Chart Image Strip */}
            {renderAnatomicalImageChart(lowerTeeth, false, true, '/img/jpg/uk-teeth-01.jpg')}

            {/* Lower Occlusal Arch Interactive Diagram */}
            <div className="perio-occlusal-strip">
              <LowerOcclusalSvg perioData={perioData} togglePerioPresent={togglePerioPresent} />
            </div>

            {/* Lower Buccal Anatomical Chart Image Strip */}
            {renderAnatomicalImageChart(lowerTeeth, false, false, '/img/jpg/uk-teeth-02.jpg')}

            {/* Lower Jaw Numeric Probing Data Table */}
            <div className="perio-table-scroll-container">
              <div className="perio-chart-table">
                {renderRowLabels(false)}
                <div className="perio-teeth-stream">
                  {lowerTeeth.map(t => renderToothGridCol(t, false))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend Strip */}
          <div className="perio-legend-strip">
            <div className="legend-entry"><span className="legend-dot bop-dot active" /> <b>BOP</b>: Bleeding on Probing (Red)</div>
            <div className="legend-entry"><span className="legend-dot plaque-dot active" /> <b>PI</b>: Plaque Present (Blue)</div>
            <div className="legend-entry"><span className="legend-badge pd-normal">1–3 mm</span> Normal Sulcus</div>
            <div className="legend-entry"><span className="legend-badge pd-moderate">4–5 mm</span> Moderate Pocket</div>
            <div className="legend-entry"><span className="legend-badge pd-severe">≥ 6 mm</span> Severe / Deep Pocket</div>
            <div className="legend-entry"><span className="legend-badge cal-badge">CAL</span> Probing Depth (PD) + Gingival Margin (GM)</div>
          </div>
        </>
      ) : (
        /* 6-Sextant Mode */
        <div className="sextant-grid" id="sextantGrid" style={{ marginTop: '16px' }}>
          {CLINICAL_CONSTANTS.SEXTANTS.map((sx, i) => (
            <div key={sx.id} className="sextant-card" data-sextant={i}>
              <div className="sx-title">
                <span className="sx-badge">{sx.name}</span>
                <span className="sx-teeth">{sx.teeth}</span>
              </div>

              <div className="sx-field">
                <label className="sx-label">CPI (Bleeding / Calculus / Pockets)</label>
                <select
                  className="input-select sx-select"
                  value={currentRecord.cpi[i] || ''}
                  onChange={e => handleCPIChange(i, e.target.value)}
                >
                  {CLINICAL_CONSTANTS.CPI_OPTS.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="sx-field">
                <label className="sx-label">LOA (Loss of Attachment)</label>
                <select
                  className="input-select sx-select"
                  value={currentRecord.loa[i] || ''}
                  onChange={e => handleLOAChange(i, e.target.value)}
                >
                  {CLINICAL_CONSTANTS.LOA_OPTS.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
