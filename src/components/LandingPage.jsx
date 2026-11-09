import React, { useState } from 'react';
import { useDental } from '../context/DentalContext';
import NitteLogo from './NitteLogo';

export default function LandingPage() {
  const { isAuthenticated, navigateTo } = useDental();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      image: '/img/hero_dental_banner.jpg',
      caption: 'A B Shetty Memorial Institute of Dental Sciences'
    }
  ];

  const handleEnterWorkstation = () => {
    if (isAuthenticated) {
      navigateTo('workstation');
    } else {
      navigateTo('login');
    }
  };

  return (
    <div className="landing-screen">
      {/* Top Bar matching screenshot */}
      <header className="landing-topbar">
        {/* Top Left: NITTE ABSMIDS official logo */}
        <div className="landing-topbar-left">
          <NitteLogo
            variant="light"
            height={44}
            className="landing-nitte-logo"
            onClick={handleEnterWorkstation}
          />
        </div>

        {/* Middle of the bar: Website name & details */}
        <div className="landing-topbar-middle">
          <div className="landing-bar-title-wrap">
            <span className="landing-bar-title">Oral Health Assessment Workstation</span>
            <span className="landing-bar-sub">Standard Digital Clinical Dental Charting Platform</span>
          </div>
        </div>

        {/* Right Corner Features: Stay the same as in the screenshot */}
        <div className="landing-topbar-right">
          <button
            type="button"
            className="landing-pill-btn"
            onClick={handleEnterWorkstation}
            title="Enter Workstation / Admissions"
          >
            ADMISSIONS 2026-27
          </button>

          <button
            type="button"
            className="landing-search-btn"
            onClick={handleEnterWorkstation}
            title="Search / Access Portal"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            type="button"
            className="landing-hamburger-btn"
            onClick={handleEnterWorkstation}
            title="Menu / Access Portal"
            aria-label="Open Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Hero Section: exact visual matching the screenshot */}
      <section className="landing-hero-container" onClick={handleEnterWorkstation}>
        <div
          className="landing-hero-image"
          style={{ backgroundImage: `url(${slides[slideIndex].image})` }}
          role="img"
          aria-label="A B Shetty Memorial Institute of Dental Sciences"
        />

        {/* Bottom Left Carousel Arrows (< >) just like in the screenshot */}
        <div className="landing-carousel-arrows" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="carousel-circle-btn"
            onClick={() => setSlideIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
            title="Previous"
            aria-label="Previous"
          >
            ❮
          </button>
          <button
            type="button"
            className="carousel-circle-btn"
            onClick={() => setSlideIndex(prev => (prev + 1) % slides.length)}
            title="Next"
            aria-label="Next"
          >
            ❯
          </button>
        </div>
      </section>
    </div>
  );
}
