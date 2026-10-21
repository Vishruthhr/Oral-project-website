import React from 'react';
import { TOOTH_COLOR_CONFIG } from '../utils/clinicalConstants';

/**
 * Anatomical Tooth SVG Generator
 * Fills entire crown when crown option selected, fills entire root when root option selected.
 * 3D anatomical shading overlay, clipPath bounds protection, crisp dark outline & CEJ line.
 */

export function getToothMorphology(num) {
  const digit = num % 10;
  if (digit === 1 || digit === 2) return { type: 'incisor' };
  if (digit === 3) return { type: 'canine' };
  if (digit === 4 || digit === 5) return { type: 'premolar' };
  return { type: 'molar' };
}

export default function AnatomicalToothSvg({
  toothNum,
  crownCode = '0',
  rootCode = '0',
  isImplant = false,
  activePart = null,
  onPartClick = null,
  mode = 'chart'
}) {
  const { type } = getToothMorphology(toothNum);
  const isDetail = mode === 'detail';
  const isMissing = crownCode === '4' || crownCode === '5';
  const isUnerupted = crownCode === '8';

  const viewBox = "0 0 100 130";
  const width = isDetail ? 220 : 42;
  const height = isDetail ? 280 : 54;

  const crownSelected = activePart === 'crown';
  const rootSelected = activePart === 'root';

  const handlePartClick = (part, e) => {
    if (onPartClick) {
      e.stopPropagation();
      onPartClick(part);
    }
  };

  // Determine Whole Crown Fill (Upper Half) & Whole Root Fill (Lower Half) from TOOTH_COLOR_CONFIG
  const crownFill = TOOTH_COLOR_CONFIG.crown[crownCode]?.color || TOOTH_COLOR_CONFIG.crown['0'].color;
  const rootFill = isImplant ? TOOTH_COLOR_CONFIG.root.implant.color : (TOOTH_COLOR_CONFIG.root[rootCode]?.color || TOOTH_COLOR_CONFIG.root['0'].color);

  const crownClipId = `crown-clip-${toothNum}-${mode}`;
  const rootClipId = `root-clip-${toothNum}-${mode}`;
  const shadingGradientId = `shading-grad-${toothNum}-${mode}`;

  // Geometry paths: UPPER HALF = CROWN (Y: 6 to 62), LOWER HALF = ROOT (Y: 62 to 126)
  const getPaths = () => {
    switch (type) {
      case 'molar':
        return {
          crownPath: "M 16,62 C 12,42 15,14 28,8 C 38,5 45,12 50,12 C 55,12 62,5 72,8 C 85,14 88,42 84,62 Z",
          rootPath: "M 18,62 C 14,82 20,118 30,125 C 38,125 44,102 48,76 C 50,72 52,72 54,76 C 58,102 64,125 72,125 C 82,118 88,82 84,62 Z",
          cejLine: "M 16,62 Q 50,68 84,62",
          grooves: "M 28,12 C 38,24 62,24 72,12 M 50,14 L 50,54 M 24,35 L 76,35"
        };
      case 'premolar':
        return {
          crownPath: "M 22,62 C 18,44 22,14 36,8 C 44,5 47,12 50,12 C 53,12 56,5 64,8 C 78,14 82,44 78,62 Z",
          rootPath: "M 24,62 C 22,82 28,118 42,125 C 47,125 49,110 50,96 C 51,110 53,125 58,125 C 72,118 78,82 76,62 Z",
          cejLine: "M 20,62 Q 50,67 80,62",
          grooves: "M 36,12 Q 50,24 64,12 M 50,16 L 50,55"
        };
      case 'canine':
        return {
          crownPath: "M 24,62 C 20,44 26,18 50,6 C 74,18 80,44 76,62 Z",
          rootPath: "M 26,62 C 24,84 36,122 50,126 C 64,122 76,84 74,62 Z",
          cejLine: "M 22,62 Q 50,67 78,62",
          grooves: "M 50,10 L 50,58"
        };
      case 'incisor':
      default:
        return {
          crownPath: "M 26,62 C 22,46 24,10 28,6 L 72,6 C 76,10 78,46 74,62 Z",
          rootPath: "M 28,62 C 26,82 38,120 50,125 C 62,120 74,82 72,62 Z",
          cejLine: "M 24,62 Q 50,66 76,62",
          grooves: "M 30,8 L 70,8"
        };
    }
  };

  const { crownPath, rootPath, cejLine, grooves } = getPaths();

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={`anatomical-tooth-svg ${isMissing ? 'is-missing' : ''} ${isUnerupted ? 'is-unerupted' : ''}`}
      aria-label={`Tooth #${toothNum}`}
    >
      <defs>
        {/* Subtle 3D Anatomical Gradient Shading Overlay */}
        <linearGradient id={shadingGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>

        {/* ClipPaths ensuring marks stay strictly inside tooth boundary */}
        <clipPath id={crownClipId}>
          <path d={crownPath} />
        </clipPath>
        <clipPath id={rootClipId}>
          <path d={rootPath} />
        </clipPath>
      </defs>

      <g className="tooth-anatomy">
        {/* ==================== CROWN GROUP (UPPER HALF) ==================== */}
        <g
          className={`tooth-crown-group ${crownSelected ? 'selected-part' : ''}`}
          onClick={(e) => handlePartClick('crown', e)}
          style={{ cursor: onPartClick ? 'pointer' : 'default' }}
        >
          {/* Upper Half Crown Filled Shape */}
          <path
            id={`crown-fill-${toothNum}-${mode}`}
            d={crownPath}
            fill={crownFill}
            stroke="#1E293B"
            strokeWidth="2.2"
            className="svg-crown-body"
            style={{ transition: 'fill 0.25s ease, opacity 0.25s ease' }}
          />
          {/* 3D Shading Overlay for Crown */}
          <path
            d={crownPath}
            fill={`url(#${shadingGradientId})`}
            pointerEvents="none"
          />
          {/* Crown Details clipped strictly inside upper half crown boundary */}
          <g clipPath={`url(#${crownClipId})`}>
            {grooves && <path d={grooves} stroke="#1E293B" strokeWidth="1.5" fill="none" opacity="0.4" />}
            {crownCode === '6' && (
              <path d={grooves} stroke="#0EA5E9" strokeWidth="3" fill="none" />
            )}
            {crownCode === 'T' && (
              <path d="M 25,20 L 45,35 L 35,55" stroke="#DC2626" strokeWidth="3.5" strokeDasharray="3 2" fill="none" />
            )}
          </g>
        </g>

        {/* ==================== CEJ CERVICAL LINE (DIVIDING NECK) ==================== */}
        <path d={cejLine} stroke="#0F172A" strokeWidth="2.5" fill="none" className="cej-line" />

        {/* ==================== ROOT GROUP (LOWER HALF) ==================== */}
        <g
          className={`tooth-root-group ${rootSelected ? 'selected-part' : ''}`}
          onClick={(e) => handlePartClick('root', e)}
          style={{ cursor: onPartClick ? 'pointer' : 'default' }}
        >
          {isImplant || rootCode === 'implant' ? (
            /* Screw Implant replacement in lower root area */
            <g className="implant-screw">
              <path d="M 35,62 L 65,62 L 58,122 L 42,122 Z" fill="#475569" stroke="#1E293B" strokeWidth="2" />
              <line x1="33" y1="75" x2="67" y2="75" stroke="#0F172A" strokeWidth="2" />
              <line x1="35" y1="90" x2="65" y2="90" stroke="#0F172A" strokeWidth="2" />
              <line x1="37" y1="105" x2="63" y2="105" stroke="#0F172A" strokeWidth="2" />
            </g>
          ) : (
            <>
              {/* Lower Half Root Filled Shape */}
              <path
                id={`root-fill-${toothNum}-${mode}`}
                d={rootPath}
                fill={rootFill}
                stroke="#1E293B"
                strokeWidth="2.2"
                className="svg-root-body"
                style={{ transition: 'fill 0.25s ease, opacity 0.25s ease' }}
              />
              {/* 3D Shading Overlay for Root */}
              <path
                d={rootPath}
                fill={`url(#${shadingGradientId})`}
                pointerEvents="none"
              />
              {/* Root Details clipped strictly inside lower half root boundary */}
              <g clipPath={`url(#${rootClipId})`}>
                {isDetail && <path d={rootPath} stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />}
                {rootCode === '7' && (
                  <line x1="50" y1="65" x2="50" y2="120" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                )}
              </g>
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
