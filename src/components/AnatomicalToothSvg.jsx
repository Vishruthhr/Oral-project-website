import React from 'react';
import { TOOTH_COLOR_CONFIG } from '../utils/clinicalConstants';

/**
 * Anatomical Tooth SVG Generator
 * Fills entire crown when crown option selected, fills entire root when root option selected.
 * 3D anatomical shading overlay, clipPath bounds protection, crisp dark outline & CEJ line.
 */

export function getToothMorphology(num) {
  const digit = num % 10;
  const isUpper = num >= 11 && num <= 28;
  if (digit === 1 || digit === 2) return { type: 'incisor', isUpper };
  if (digit === 3) return { type: 'canine', isUpper };
  if (digit === 4 || digit === 5) return { type: 'premolar', isUpper };
  return { type: isUpper ? 'upper_molar' : 'lower_molar', isUpper };
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
  const { type, isUpper } = getToothMorphology(toothNum);
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

  // Determine Whole Crown Fill & Whole Root Fill from TOOTH_COLOR_CONFIG
  const crownFill = TOOTH_COLOR_CONFIG.crown[crownCode]?.color || TOOTH_COLOR_CONFIG.crown['0'].color;
  const rootFill = isImplant ? TOOTH_COLOR_CONFIG.root.implant.color : (TOOTH_COLOR_CONFIG.root[rootCode]?.color || TOOTH_COLOR_CONFIG.root['0'].color);

  const crownClipId = `crown-clip-${toothNum}-${mode}`;
  const rootClipId = `root-clip-${toothNum}-${mode}`;
  const shadingGradientId = `shading-grad-${toothNum}-${mode}`;

  // Geometry paths per morphology type
  const getPaths = () => {
    switch (type) {
      case 'upper_molar':
        return {
          crownPath: "M 15,55 C 12,75 14,105 28,118 C 38,124 62,124 72,118 C 86,105 88,75 85,55 Z",
          rootPath: "M 22,55 C 16,35 12,18 20,8 C 26,8 30,25 34,55 M 36,55 C 44,28 48,6 52,6 C 56,6 58,28 62,55 M 64,55 C 68,25 74,8 80,8 C 88,18 84,35 78,55 Z",
          cejLine: "M 15,55 Q 50,60 85,55",
          grooves: "M 30,118 C 38,105 62,105 70,118 M 50,58 L 50,115 M 25,85 L 75,85"
        };
      case 'lower_molar':
        return {
          crownPath: "M 15,75 C 12,55 14,25 28,12 C 38,6 62,6 72,12 C 86,25 88,55 85,75 Z",
          rootPath: "M 18,75 C 14,95 20,120 30,125 C 38,125 44,105 48,75 M 52,75 C 56,105 62,125 70,125 C 80,120 86,95 82,75 Z",
          cejLine: "M 15,75 Q 50,70 85,75",
          grooves: "M 30,12 C 38,25 62,25 70,12 M 50,15 L 50,72 M 25,45 L 75,45"
        };
      case 'premolar':
        return isUpper ? {
          crownPath: "M 22,55 C 18,75 22,108 36,120 C 50,125 64,125 78,120 C 82,108 82,75 78,55 Z",
          rootPath: "M 28,55 C 22,35 25,12 36,8 C 44,18 46,38 50,55 M 50,55 C 54,38 56,18 64,8 C 75,12 78,35 72,55 Z",
          cejLine: "M 22,55 Q 50,60 78,55",
          grooves: "M 36,120 Q 50,105 64,120 M 50,58 L 50,118"
        } : {
          crownPath: "M 22,70 C 18,50 22,17 36,8 C 50,3 64,3 78,8 C 82,17 82,50 78,70 Z",
          rootPath: "M 28,70 C 24,90 32,122 50,125 C 68,122 76,90 72,70 Z",
          cejLine: "M 22,70 Q 50,65 78,70",
          grooves: "M 36,8 Q 50,23 64,8 M 50,10 L 50,68"
        };
      case 'canine':
        return isUpper ? {
          crownPath: "M 24,50 C 20,70 30,110 50,126 C 70,110 80,70 76,50 Z",
          rootPath: "M 30,50 C 22,30 35,5 50,3 C 65,5 78,30 70,50 Z",
          cejLine: "M 24,50 Q 50,55 76,50",
          grooves: "M 50,55 L 50,123"
        } : {
          crownPath: "M 24,75 C 20,55 30,15 50,3 C 70,15 80,55 76,75 Z",
          rootPath: "M 30,75 C 22,95 35,122 50,126 C 65,122 78,95 70,75 Z",
          cejLine: "M 24,75 Q 50,70 76,75",
          grooves: "M 50,70 L 50,6"
        };
      case 'incisor':
      default:
        return isUpper ? {
          crownPath: "M 25,50 C 22,70 25,122 28,124 L 72,124 C 75,122 78,70 75,50 Z",
          rootPath: "M 32,50 C 26,30 38,6 50,4 C 62,6 74,30 68,50 Z",
          cejLine: "M 25,50 Q 50,55 75,50",
          grooves: "M 28,124 L 72,124"
        } : {
          crownPath: "M 25,75 C 22,55 25,6 28,4 L 72,4 C 75,6 78,55 75,75 Z",
          rootPath: "M 32,75 C 26,95 38,122 50,125 C 62,122 74,95 68,75 Z",
          cejLine: "M 25,75 Q 50,70 75,75",
          grooves: "M 28,4 L 72,4"
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
        {/* ==================== ROOT GROUP ==================== */}
        <g
          className={`tooth-root-group ${rootSelected ? 'selected-part' : ''}`}
          onClick={(e) => handlePartClick('root', e)}
        >
          {isImplant ? (
            /* Screw Implant replacement */
            <g className="implant-screw">
              <path d={isUpper ? "M35,10 L65,10 L58,55 L42,55 Z" : "M35,75 L65,75 L58,120 L42,120 Z"} fill="#475569" stroke="#1E293B" strokeWidth="2" />
              {isUpper ? (
                <>
                  <line x1="33" y1="20" x2="67" y2="20" stroke="#0F172A" strokeWidth="2" />
                  <line x1="35" y1="30" x2="65" y2="30" stroke="#0F172A" strokeWidth="2" />
                  <line x1="37" y1="40" x2="63" y2="40" stroke="#0F172A" strokeWidth="2" />
                </>
              ) : (
                <>
                  <line x1="33" y1="85" x2="67" y2="85" stroke="#0F172A" strokeWidth="2" />
                  <line x1="35" y1="95" x2="65" y2="95" stroke="#0F172A" strokeWidth="2" />
                  <line x1="37" y1="105" x2="63" y2="105" stroke="#0F172A" strokeWidth="2" />
                </>
              )}
            </g>
          ) : (
            <>
              {/* Whole Root Filled Shape */}
              <path
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
              {/* Root Details clipped strictly inside root boundary */}
              <g clipPath={`url(#${rootClipId})`}>
                {isDetail && <path d={rootPath} stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />}
                {rootCode === '7' && (
                  <line x1="50" y1={isUpper ? "10" : "75"} x2="50" y2={isUpper ? "50" : "120"} stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                )}
              </g>
            </>
          )}
        </g>

        {/* ==================== CEJ CERVICAL LINE ==================== */}
        <path d={cejLine} stroke="#0F172A" strokeWidth="2.5" fill="none" className="cej-line" />

        {/* ==================== CROWN GROUP ==================== */}
        <g
          className={`tooth-crown-group ${crownSelected ? 'selected-part' : ''}`}
          onClick={(e) => handlePartClick('crown', e)}
        >
          {/* Whole Crown Filled Shape */}
          <path
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
          {/* Crown Details clipped strictly inside crown boundary */}
          <g clipPath={`url(#${crownClipId})`}>
            {grooves && <path d={grooves} stroke="#1E293B" strokeWidth="1.5" fill="none" opacity="0.4" />}
            {crownCode === '6' && (
              <path d={grooves} stroke="#0EA5E9" strokeWidth="3" fill="none" />
            )}
            {crownCode === 'T' && (
              <path d="M 15,80 L 35,95 L 25,115" stroke="#DC2626" strokeWidth="3.5" strokeDasharray="3 2" fill="none" />
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
