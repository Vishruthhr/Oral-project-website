import React from 'react';
import { useDental } from '../context/DentalContext';

/**
 * NitteLogo - Official branding component for NITTE (Deemed to be University)
 * and A B Shetty Memorial Institute of Dental Sciences.
 *
 * @param {('light'|'dark'|'auto')} variant - 'light' for dark backgrounds (white logo), 'dark' for light backgrounds (navy logo)
 * @param {number|string} height - Height of the logo in pixels
 * @param {function} onClick - Optional click handler (e.g. to navigate to landing page)
 * @param {string} className - Optional extra class names
 */
export default function NitteLogo({
  variant = 'auto',
  height = 42,
  onClick,
  className = ''
}) {
  const { theme } = useDental?.() || { theme: 'light' };

  // Determine effective color mode
  const effectiveVariant = variant === 'auto'
    ? (theme === 'dark' ? 'light' : 'dark')
    : variant;

  const isLight = effectiveVariant === 'light';

  const logoSrc = isLight
    ? '/img/nitte_logo_white_transparent.png'
    : '/img/nitte_logo_dark_transparent.png';

  return (
    <div
      className={`nitte-brand-wrapper ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      title="A B Shetty Memorial Institute of Dental Sciences — NITTE (Deemed to be University)"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* High-fidelity transparent logo image extracted from official branding */}
      <img
        src={logoSrc}
        alt="NITTE | A B Shetty Memorial Institute of Dental Sciences"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        onError={(e) => {
          // Fallback to vector SVG if PNG fails to load
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = 'inline-flex';
        }}
      />

      {/* Vector SVG Fallback with identical typography & shield emblem */}
      <div
        className="nitte-vector-fallback"
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '12px',
          color: isLight ? '#FFFFFF' : '#0F172A',
        }}
      >
        <svg
          width={Math.round(height * 0.7)}
          height={height}
          viewBox="0 0 40 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M20 2L4 8V24C4 33.5 10.8 42.4 20 46C29.2 42.4 36 33.5 36 24V8L20 2Z"
            stroke={isLight ? '#FFFFFF' : '#0F172A'}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M13 32V16L27 32V16"
            stroke={isLight ? '#FFFFFF' : '#0F172A'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.04em' }}>NITTE</span>
          <span style={{ fontSize: '8.5px', opacity: 0.85, fontWeight: '500' }}>(Deemed to be University)</span>
          <span style={{ fontSize: '7px', opacity: 0.75, fontStyle: 'italic' }}>Where there is space for every dream</span>
        </div>

        <div
          style={{
            width: '1.5px',
            height: `${Math.round(height * 0.75)}px`,
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.3)',
            margin: '0 4px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em' }}>A B SHETTY MEMORIAL</span>
          <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.03em' }}>INSTITUTE OF DENTAL SCIENCES</span>
        </div>
      </div>
    </div>
  );
}
