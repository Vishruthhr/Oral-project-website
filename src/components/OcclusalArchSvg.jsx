import React from 'react';

export function UpperOcclusalSvg({ perioData = {}, togglePerioPresent }) {
  return (
    <svg
      id="upper-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 834 81"
      className="occlusal-jaw-svg"
    >
      <style>{`
        .upper-jaw-surface {
          stroke: #94A3B8;
          stroke-width: 1.2;
          fill: #F8FAFC;
          transition: fill 0.15s ease, stroke 0.15s ease;
          cursor: pointer;
        }
        .upper-jaw-surface:hover {
          fill: #E0F2FE;
          stroke: #0284C7;
        }
        [data-theme="dark"] .upper-jaw-surface {
          stroke: #475569;
          fill: #1E293B;
        }
        [data-theme="dark"] .upper-jaw-surface:hover {
          fill: #0F2D4A;
          stroke: #38BDF8;
        }
        .tooth-group.missing .upper-jaw-surface {
          fill: #E2E8F0;
          stroke: #CBD5E1;
          opacity: 0.4;
        }
        [data-theme="dark"] .tooth-group.missing .upper-jaw-surface {
          fill: #0F172A;
          stroke: #334155;
          opacity: 0.4;
        }
        .tooth-lbl-svg {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 800;
          fill: #0284C7;
          text-anchor: middle;
          pointer-events: none;
        }
        [data-theme="dark"] .tooth-lbl-svg {
          fill: #38BDF8;
        }
      `}</style>

      <g id="upper-teeth">
        {/* Tooth 18 */}
        <g id="tooth-18" className={`tooth-group ${perioData[18]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(18)}>
          <path id="surface-18p" className="upper-jaw-surface" d="M44.2,68.8c8.8,0.6,13.8,0.6,20.3-5.2c1.3-1,1.9-2.4,2.3-3.8L48,41.4l-18.5,20C33,65.9,38,68.4,44.2,68.8z"/>
          <path id="surface-18d" className="upper-jaw-surface" d="M30,23.5c-1.7,1.5-2.9,3.1-3.5,5.9c-1,4-0.4,6.3-1,10.5c-1.5,9,0.2,16.4,4,21.4l18.5-20L30,23.5z"/>
          <path id="surface-18b" className="upper-jaw-surface" d="M70.6,17.1c-2.9-1.9-6.1-2.9-8.2-2.9c-8-0.6-13.2,4.8-21.1,5.4c-5,0.4-8.8,1.7-11.3,4l18,17.8L70.6,17.1z"/>
          <path id="surface-18m" className="upper-jaw-surface" d="M66.8,59.7c1.3-3.6,1-7.7,2.9-11.1c4-6.7,8.2-11.3,8.6-19c0.2-5.7-3.6-9.8-7.7-12.6L48,41.3L66.8,59.7z"/>
          <text x="48" y="44" className="tooth-lbl-svg">18</text>
        </g>

        {/* Tooth 17 */}
        <g id="tooth-17" className={`tooth-group ${perioData[17]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(17)}>
          <path id="surface-17p" className="upper-jaw-surface" d="M78.5,63.3c0.6,0.6,1.5,1.5,2.3,2.1c2.7,2.3,6.1,2.3,8.4,3.6c6.1,3.3,13.4,3.8,20.3,2.7c4.2-0.6,7.5-2.5,9.8-4.8l-17.8-27.4L78.5,63.3z"/>
          <path id="surface-17b" className="upper-jaw-surface" d="M127.1,13.3c-6.3-3.8-14.9-2.5-16.5-2.3c-4.4,0.6-15.3-0.6-17.8-0.2c-3.1,0.4-5.4,1.9-7.3,3.8l16.1,24.9L127.1,13.3z"/>
          <path id="surface-17d" className="upper-jaw-surface" d="M75.2,54.9c0.6,4.4,1.5,6.5,3.3,8.4l23-23.9L85.4,14.5c-3.6,3.8-4.8,10-5.4,16.3C79.2,40.5,73.7,45.1,75.2,54.9z"/>
          <path id="surface-17m" className="upper-jaw-surface" d="M119.3,66.9c4.4-4.4,6.9-11.1,8.6-18.4c1.9-8,4-13.6,5.4-21.6c0.4-2.5,0.2-4.8-1-7.5c-1.3-2.7-3.1-4.8-5.2-6.1l-25.5,26.2L119.3,66.9z"/>
          <text x="101" y="44" className="tooth-lbl-svg">17</text>
        </g>

        {/* Tooth 16 */}
        <g id="tooth-16" className={`tooth-group ${perioData[16]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(16)}>
          <path id="surface-16p" className="upper-jaw-surface" d="M135.1,62.9c3.3,5,9,7.7,15.9,9s11.5,2.3,18.2,0.2c4.4-1.3,8.2-3.1,11.3-5.4l-20.6-28L135.1,62.9z"/>
          <path id="surface-16b" className="upper-jaw-surface" d="M186.7,12.7c-5-2.9-12.3-2.3-18.2-2.5c-6.9-0.4-13.4,1-19,3.6c-2.1,0.8-3.9,1.9-5.6,2.9l16.1,22L186.7,12.7z"/>
          <path id="surface-16d" className="upper-jaw-surface" d="M132.6,56.4c0.4,2.5,1.5,4.6,2.5,6.5l24.8-24.3l-16.1-22c-3.8,2.3-6.6,5.2-7.9,9.4C132.4,38.2,131.6,50.3,132.6,56.4z"/>
          <path id="surface-16m" className="upper-jaw-surface" d="M180.6,66.6c9-6.5,14.1-16.7,15.4-29.1c0.4-3.8,1.1-19.8-9.2-24.9L160,38.5L180.6,66.6z"/>
          <text x="160" y="44" className="tooth-lbl-svg">16</text>
        </g>

        {/* Tooth 15 */}
        <g id="tooth-15" className={`tooth-group ${perioData[15]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(15)}>
          <path id="surface-15p" className="upper-jaw-surface" d="M200.1,49.1c1.3,1.9,2.5,3.8,4,6.1c2.7,4.8,7.5,8.8,13.6,8.2c5.7-0.6,8.2-5.9,11.9-9.4c1-1,1.4-1.6,2.1-2.5l-16.1-18.4L200.1,49.1z"/>
          <path id="surface-15b" className="upper-jaw-surface" d="M232.6,15c-1-1-2.1-1.9-3.6-2.5c-5.7-2.9-10-1.5-16.1,0.4c-4.2,1.3-8,1.9-10.5,4.8L215.6,33L232.6,15z"/>
          <path id="surface-15d" className="upper-jaw-surface" d="M200.1,49.1L215.6,33l-13.2-15.3c-0.3,0.3-0.7,0.9-1,1.5c-2.3,3.8-2.1,6.3-3.1,10.5c-0.4,1.5-1.5,7.5-0.8,12.3C197.8,44.9,198.7,47,200.1,49.1z"/>
          <path id="surface-15m" className="upper-jaw-surface" d="M231.7,51.4c4-5,5.4-12.1,5.9-20.1c0.4-6.5-0.8-12.4-5-16.4l-17,18L231.7,51.4z"/>
          <text x="215" y="44" className="tooth-lbl-svg">15</text>
        </g>

        {/* Tooth 14 */}
        <g id="tooth-14" className={`tooth-group ${perioData[14]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(14)}>
          <path id="surface-14p" className="upper-jaw-surface" d="M258.1,32.1L243,48.4c1.9,5,4,9.4,9.6,10.5c4.2,0.8,8,0,10.7-2.3c3.3-2.7,7.1-3.8,10.3-7.1L258.1,32.1z"/>
          <path id="surface-14b" className="upper-jaw-surface" d="M273.4,15.2c-1.7-1.9-3.8-3.6-5.9-4.4c-4.8-2.1-9.4-0.6-15.1,1.5c-3.3,1.3-6.3,2.1-8.6,4L258,32.2L273.4,15.2z"/>
          <path id="surface-14d" className="upper-jaw-surface" d="M243,48.4l15.1-16.3l-14.2-15.9c-0.8,0.8-1.5,1.7-2.1,2.9c-1.7,4.2-1,6.7-1.9,11.1c-1,6.1-0.2,9,1.7,14.2C242,45.7,242.6,47,243,48.4z"/>
          <path id="surface-14m" className="upper-jaw-surface" d="M258.1,32.1l15.5,17.4c0.2-0.2,0.4-0.4,0.6-0.6c5.4-6.7,6.9-13,5-21.6c-1-4.8-3.1-9-5.9-12.1L258.1,32.1z"/>
          <text x="258" y="44" className="tooth-lbl-svg">14</text>
        </g>

        {/* Tooth 13 */}
        <g id="tooth-13" className={`tooth-group ${perioData[13]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(13)}>
          <path id="surface-13p" className="upper-jaw-surface" d="M302.9,31.1l-15.1,18.4c1.5,3.3,3.1,5.7,7.5,6.9c5,1.5,8.4,0.4,13.2-1.3c3.8-1.5,7.1-4,9.6-7.3L302.9,31.1z"/>
          <path id="surface-13b" className="upper-jaw-surface" d="M317.5,13.3c-1.7-1.5-3.8-2.5-6.7-3.3c-4.8-1.5-10.5,0-12.8,0.8c-3.8,1.5-6.9,2.9-9.4,4.6l14.2,15.7L317.5,13.3z"/>
          <path id="surface-13d" className="upper-jaw-surface" d="M288.6,15.4c-2.7,1.9-4.8,4.4-6.1,8.2c-1.9,5.4-1.3,10.7,0.8,14.6c2.3,4.4,3.1,8.4,4.4,11.3l15.1-18.4L288.6,15.4z"/>
          <path id="surface-13m" className="upper-jaw-surface" d="M318.2,47.8c6.1-7.3,8.8-18,4.8-26.2c-1.9-4.2-3.3-6.5-5.4-8.4l-14.7,17.9L318.2,47.8z"/>
          <text x="303" y="44" className="tooth-lbl-svg">13</text>
        </g>

        {/* Tooth 12 */}
        <g id="tooth-12" className={`tooth-group ${perioData[12]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(12)}>
          <path id="surface-12p" className="upper-jaw-surface" d="M333,42.2c1.3,2.3,2.9,4,5.9,5.4c6.5,3.1,12.8,0.2,17.8-4.8l-11.8-13.5L333,42.2z"/>
          <path id="surface-12b" className="upper-jaw-surface" d="M361.3,11.3c-6.3-2.1-23-2.5-31.2,1.9l14.6,16.1L361.3,11.3z"/>
          <path id="surface-12d" className="upper-jaw-surface" d="M333,42.2l11.8-12.9l-14.6-16.2c-1.7,1-3,2.2-3.8,3.7c-3.3,5.9,1.3,10.5,3.6,16.7C330.9,36.9,331.8,39.9,333,42.2z"/>
          <path id="surface-12m" className="upper-jaw-surface" d="M356.7,42.8c3.3-3.3,6.1-7.7,8.2-11.9c3.1-6.7,4.4-15.8-1.9-18.8c-0.4-0.2-0.9-0.6-1.6-0.8l-16.5,18L356.7,42.8z"/>
          <text x="345" y="44" className="tooth-lbl-svg">12</text>
        </g>

        {/* Tooth 11 */}
        <g id="tooth-11" className={`tooth-group ${perioData[11]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(11)}>
          <path id="surface-11p" className="upper-jaw-surface" d="M376.1,46.1c1.5,1.5,3.1,2.9,5.4,4c4.2,1.9,7.3,2.3,11.9,1.5c3.1-0.6,6.9-4,10.3-7.5l-13.2-13.9L376.1,46.1z"/>
          <path id="surface-11b" className="upper-jaw-surface" d="M409.2,9.3c-6.1-1.9-18.6-4-29.3,0c-2.3,0.8-4.4,1.9-6.1,3.1l16.7,17.8L409.2,9.3z"/>
          <path id="surface-11d" className="upper-jaw-surface" d="M373.8,12.4c-2.1,1.7-3.6,3.8-4.6,6.7c-1.3,3.8-0.8,10.9,1.5,17.2c1.5,4,2.9,7.3,5.4,9.8l14.4-15.9L373.8,12.4z"/>
          <path id="surface-11m" className="upper-jaw-surface" d="M410.7,9.8c-0.5-0.1-1.1-0.3-1.5-0.4l-18.7,20.8L403.8,44c3.1-3.3,4.7-5.8,6.4-7.5c1.5-1.5,5.9-7.7,6.5-11.1C418.1,20,419,12.3,410.7,9.8z"/>
          <text x="392" y="44" className="tooth-lbl-svg">11</text>
        </g>

        {/* Tooth 21 */}
        <g id="tooth-21" className={`tooth-group ${perioData[21]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(21)}>
          <path id="surface-21p" className="upper-jaw-surface" d="M460.4,47.2c-1.5,1.5-3.1,2.9-5.4,4c-4.2,1.9-7.3,2.3-11.9,1.5c-3.1-0.6-6.9-4-10.3-7.5l13.3-13.8L460.4,47.2z"/>
          <path id="surface-21b" className="upper-jaw-surface" d="M427.3,10.4c6.1-1.9,18.6-4,29.3,0c2.3,0.8,4.4,1.9,6.1,3.1L446,31.3L427.3,10.4z"/>
          <path id="surface-21d" className="upper-jaw-surface" d="M462.7,13.5c2.1,1.7,3.6,3.8,4.6,6.7c1.3,3.8,0.8,10.9-1.5,17.2c-1.5,4-2.9,7.3-5.4,9.8L446,31.3L462.7,13.5z"/>
          <path id="surface-21m" className="upper-jaw-surface" d="M425.8,10.8c0.5-0.1,1.1-0.3,1.5-0.4L446,31.3l-13.2,13.8c-3.1-3.3-4.7-5.8-6.4-7.5c-1.5-1.5-5.9-7.7-6.5-11.1C418.4,21.1,417.5,13.4,425.8,10.8z"/>
          <text x="444" y="44" className="tooth-lbl-svg">21</text>
        </g>

        {/* Tooth 22 */}
        <g id="tooth-22" className={`tooth-group ${perioData[22]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(22)}>
          <path id="surface-22p" className="upper-jaw-surface" d="M503.5,43.3c-1.3,2.3-2.9,4-5.9,5.4c-6.5,3.1-12.8,0.2-17.8-4.8l11.8-13.5L503.5,43.3z"/>
          <path id="surface-22b" className="upper-jaw-surface" d="M475.2,12.4c6.3-2.1,23-2.5,31.2,1.9l-14.6,16.1L475.2,12.4z"/>
          <path id="surface-22d" className="upper-jaw-surface" d="M503.5,43.3l-11.8-12.9l14.6-16.1c1.7,1,3,2.2,3.8,3.7c3.3,5.9-1.3,10.5-3.6,16.7C505.6,38,504.7,41,503.5,43.3z"/>
          <path id="surface-22m" className="upper-jaw-surface" d="M479.8,43.9c-3.3-3.3-6.1-7.7-8.2-11.9c-3.1-6.7-4.4-15.8,1.9-18.8c0.4-0.2,0.9-0.6,1.6-0.8l16.5,18L479.8,43.9z"/>
          <text x="490" y="44" className="tooth-lbl-svg">22</text>
        </g>

        {/* Tooth 23 */}
        <g id="tooth-23" className={`tooth-group ${perioData[23]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(23)}>
          <path id="surface-23p" className="upper-jaw-surface" d="M533.6,32.2l15.1,18.4c-1.5,3.3-3.1,5.7-7.5,6.9c-5,1.5-8.4,0.4-13.2-1.3c-3.8-1.5-7.1-4-9.6-7.3L533.6,32.2z"/>
          <path id="surface-23b" className="upper-jaw-surface" d="M519,14.4c1.7-1.5,3.8-2.5,6.7-3.3c4.8-1.5,10.5,0,12.8,0.8c3.8,1.5,6.9,2.9,9.4,4.6l-14.2,15.7L519,14.4z"/>
          <path id="surface-23d" className="upper-jaw-surface" d="M547.9,16.5c2.7,1.9,4.8,4.4,6.1,8.2c1.9,5.4,1.3,10.7-0.8,14.6c-2.3,4.4-3.1,8.4-4.4,11.3l-15.1-18.4L547.9,16.5z"/>
          <path id="surface-23m" className="upper-jaw-surface" d="M518.3,48.9c-6.1-7.3-8.8-18-4.8-26.2c1.9-4.2,3.3-6.5,5.4-8.4l14.6,17.8L518.3,48.9z"/>
          <text x="532" y="44" className="tooth-lbl-svg">23</text>
        </g>

        {/* Tooth 24 */}
        <g id="tooth-24" className={`tooth-group ${perioData[24]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(24)}>
          <path id="surface-24p" className="upper-jaw-surface" d="M578.4,33.2l15.1,16.3c-1.9,5-4,9.4-9.6,10.5c-4.2,0.8,8,0,10.7-2.3c-3.3-2.7-7.1-3.8-10.3-7.1L578.4,33.2z"/>
          <path id="surface-24b" className="upper-jaw-surface" d="M563.1,16.3c1.7-1.9,3.8-3.6,5.9-4.4c4.8-2.1,9.4-0.6,15.1,1.5c3.3,1.3,6.3,2.1,8.6,4l-14.2,15.9L563.1,16.3z"/>
          <path id="surface-24d" className="upper-jaw-surface" d="M593.5,49.5l-15.1-16.3l14.2-15.9c0.8,0.8,1.5,1.7,2.1,2.9c1.7,4.2,1,6.7,1.9,11.1c1,6.1,0.2,9-1.7,14.2C594.5,46.8,593.9,48.1,593.5,49.5z"/>
          <path id="surface-24m" className="upper-jaw-surface" d="M578.4,33.2l-15.5,17.4c-0.2-0.2-0.4-0.4-0.6-0.6c5.4-6.7,6.9-13,5-21.6c-1-4.8-3.1-9-5.9-12.1L578.4,33.2z"/>
          <text x="577" y="44" className="tooth-lbl-svg">24</text>
        </g>

        {/* Tooth 25 */}
        <g id="tooth-25" className={`tooth-group ${perioData[25]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(25)}>
          <path id="surface-25p" className="upper-jaw-surface" d="M636.4,50.2c-1.3,1.9-2.5,3.8-4,6.1c-2.7,4.8-7.5,8.8-13.6,8.2c-5.7-0.6-8.2-5.9-11.9-9.4c-1-1-1.4-1.6-2.1-2.5l16.1-18.4L636.4,50.2z"/>
          <path id="surface-25b" className="upper-jaw-surface" d="M603.9,16c1-1,2.1-1.9,3.6-2.5c5.7-2.9,10-1.5,16.1,0.4c4.2,1.3,8,1.9,10.5,4.8L620.9,34L603.9,16z"/>
          <path id="surface-25d" className="upper-jaw-surface" d="M636.4,50.2l-15.5-16.1l13.2-15.3c0.3,0.3,0.7,0.9,1,1.5c2.3,3.8,2.1,6.3,3.1,10.5c0.4,1.5,1.5,7.5,0.8,12.3C638.7,46,637.8,48.1,636.4,50.2z"/>
          <path id="surface-25m" className="upper-jaw-surface" d="M604.8,52.5c-4-5-5.4-12.1-5.9-20.1c0.4-6.5-0.8-12.4-5-16.4l17,18L604.8,52.5z"/>
          <text x="620" y="44" className="tooth-lbl-svg">25</text>
        </g>

        {/* Tooth 26 */}
        <g id="tooth-26" className={`tooth-group ${perioData[26]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(26)}>
          <path id="surface-26p" className="upper-jaw-surface" d="M701.3,64c-3.3,5-9,7.7-15.9,9s-11.5,2.3-18.2,0.2c-4.4-1.3-8.2-3.1-11.3-5.4l20.6-28L701.3,64z"/>
          <path id="surface-26b" className="upper-jaw-surface" d="M649.8,13.7c5-2.9,12.3-2.3,18.2-2.5c6.9-0.4,13.4,1,19,3.6c2.1,0.8,3.9,1.9,5.6,2.9l-16.1,22L649.8,13.7z"/>
          <path id="surface-26d" className="upper-jaw-surface" d="M703.9,57.5c-0.4,2.5-1.5,4.6-2.5,6.5l-24.8-24.3l16.1-22c3.8,2.3,6.6,5.2,7.9,9.4C704.1,39.3,704.9,51.4,703.9,57.5z"/>
          <path id="surface-26m" className="upper-jaw-surface" d="M655.9,67.7c-9-6.5,14.1-16.7,15.4-29.1c-0.4-3.8-1.1-19.8-9.2-24.9l26.8,25.9L655.9,67.7z"/>
          <text x="675" y="44" className="tooth-lbl-svg">26</text>
        </g>

        {/* Tooth 27 */}
        <g id="tooth-27" className={`tooth-group ${perioData[27]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(27)}>
          <path id="surface-27p" className="upper-jaw-surface" d="M758,64.4c-0.6,0.6-1.5,1.5-2.3,2.1c-2.7,2.3-6.1,2.3-8.4,3.6c-6.1,3.3-13.4,3.8-20.3,2.7c-4.2-0.6-7.5-2.5-9.8-4.8L735,40.6L758,64.4z"/>
          <path id="surface-27b" className="upper-jaw-surface" d="M709.4,14.4c6.3-3.8,14.9-2.5,16.5-2.3c4.4,0.6,15.3-0.6,17.8-0.2c-3.1,0.4-5.4,1.9-7.3,3.8l-16.1,24.9L709.4,14.4z"/>
          <path id="surface-27d" className="upper-jaw-surface" d="M761.3,56c-0.6,4.4-1.5,6.5-3.3,8.4l-23-23.9l16.1-24.9c3.6,3.8,4.8,10,5.4,16.3C757.3,41.6,762.8,46.2,761.3,56z"/>
          <path id="surface-27m" className="upper-jaw-surface" d="M717.2,67.9c-4.4-4.4-6.9-11.1-8.6-18.4c-1.9-8-4-13.6-5.4-21.6c-0.4-2.5-0.2-4.8-1-7.5c-1.3-2.7-3.1-4.8-5.2-6.1l25.5,26.2L717.2,67.9z"/>
          <text x="734" y="44" className="tooth-lbl-svg">27</text>
        </g>

        {/* Tooth 28 */}
        <g id="tooth-28" className={`tooth-group ${perioData[28]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(28)}>
          <path id="surface-28p" className="upper-jaw-surface" d="M792.3,69.9c-8.8,0.6-13.8,0.6-20.3-5.2c-1.3-1-1.9-2.4-2.3-3.8l18.8-18.4l18.5,20C803.5,67,798.5,69.5,792.3,69.9z"/>
          <path id="surface-28b" className="upper-jaw-surface" d="M765.9,18.1c2.9-1.9,6.1-2.9,8.2-2.9c8-0.6,13.2,4.8,21.1,5.4c5,0.4,8.8,1.7-11.3,4l-18,17.8L765.9,18.1z"/>
          <path id="surface-28d" className="upper-jaw-surface" d="M806.5,24.6c1.7,1.5,2.9,3.1,3.5,5.9c1,4,0.4,6.3,1,10.5c1.5,9-0.2,16.4-4,21.4l-18.5-20L806.5,24.6z"/>
          <path id="surface-28m" className="upper-jaw-surface" d="M769.7,60.8c-1.3-3.6-1-7.7-2.9-11.1c-4-6.7-8.2-11.3-8.6-19c-0.2-5.7,3.6-9.8,7.7-12.6l22.6,24.3L769.7,60.8z"/>
          <text x="786" y="44" className="tooth-lbl-svg">28</text>
        </g>
      </g>
    </svg>
  );
}

export function LowerOcclusalSvg({ perioData = {}, togglePerioPresent }) {
  return (
    <svg
      id="lower-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 834 81"
      className="occlusal-jaw-svg"
    >
      <style>{`
        .lower-jaw-surface {
          stroke: #94A3B8;
          stroke-width: 1.2;
          fill: #F8FAFC;
          transition: fill 0.15s ease, stroke 0.15s ease;
          cursor: pointer;
        }
        .lower-jaw-surface:hover {
          fill: #E0F2FE;
          stroke: #0284C7;
        }
        [data-theme="dark"] .lower-jaw-surface {
          stroke: #475569;
          fill: #1E293B;
        }
        [data-theme="dark"] .lower-jaw-surface:hover {
          fill: #0F2D4A;
          stroke: #38BDF8;
        }
        .tooth-group.missing .lower-jaw-surface {
          fill: #E2E8F0;
          stroke: #CBD5E1;
          opacity: 0.4;
        }
        [data-theme="dark"] .tooth-group.missing .lower-jaw-surface {
          fill: #0F172A;
          stroke: #334155;
          opacity: 0.4;
        }
        .tooth-lbl-svg {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 800;
          fill: #0284C7;
          text-anchor: middle;
          pointer-events: none;
        }
        [data-theme="dark"] .tooth-lbl-svg {
          fill: #38BDF8;
        }
      `}</style>

      <g id="lower-teeth">
        {/* Tooth 48 */}
        <g id="tooth-48" className={`tooth-group ${perioData[48]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(48)}>
          <path id="surface-48l" className="lower-jaw-surface" d="M78.9,12.8c-1.5-1.1-3.2-2.2-5.2-2.8c-6.5-2.4-8.9,0-14,0.6c-7.1,0.9-14.5-6.7-25.3,5.6l21.2,22.3L78.9,12.8z"/>
          <path id="surface-48b" className="lower-jaw-surface" d="M34.6,61.4c3.7,3.2,8,5.4,13.8,7.6c11.5,4.3,25.1,3.7,31.1-5.2l-24-25.3L34.6,61.4z"/>
          <path id="surface-48d" className="lower-jaw-surface" d="M34.4,16.2c-1.1,1.3-2.2,2.6-3.2,4.1c-4.5,6.3-2.6,13.2-4.1,19c-1.7,6-1.3,11.2,2.4,16.4c1.7,2.4,3.5,4.1,5.2,5.6l21-22.9L34.4,16.2z"/>
          <path id="surface-48m" className="lower-jaw-surface" d="M78.9,12.8L55.6,38.5l24,25.3c0.6-0.9,1.3-1.9,1.7-3.2C87.3,44.7,91.4,22.5,78.9,12.8z"/>
          <text x="56" y="44" className="tooth-lbl-svg">48</text>
        </g>

        {/* Tooth 47 */}
        <g id="tooth-47" className={`tooth-group ${perioData[47]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(47)}>
          <path id="surface-47l" className="lower-jaw-surface" d="M144.8,8.3c-7.1-2.8-12.7,1.5-16.6,1.3C121.9,9,117,5.1,110.7,5.9c-4.3,0.6-8,1.7-11.2,3.7l19.4,27.7L144.8,8.3z"/>
          <path id="surface-47b" className="lower-jaw-surface" d="M92.3,66.8c0.4,0.4,1.1,0.6,1.5,1.1c5.4,4.1,13.4,2.2,17.5,1.5c8.4,1.7,16.9,8,26.6,3.9c1.7-0.6,3-1.7,4.5-2.6l-23.5-33.5L92.3,66.8z"/>
          <path id="surface-47d" className="lower-jaw-surface" d="M99.4,9.6c-3.5,2.2-6,5.4-7.6,10.2c-3,8.9-0.9,13.2-2.8,22.3c-1.3,6.7-2.6,12.3-0.6,18.8c0.9,2.6,1.9,4.3,3.9,6l26.6-29.6L99.4,9.6z"/>
          <path id="surface-47m" className="lower-jaw-surface" d="M145.6,8.7c-0.3-0.1-0.4-0.3-0.9-0.4l-25.9,29l23.5,33.5c3.9-2.6,6.5-5.8,8.9-10.6c4.1-8.9,5.4-20.3,4.1-31.8C154.5,19.9,153.6,12.4,145.6,8.7z"/>
          <text x="122" y="44" className="tooth-lbl-svg">47</text>
        </g>

        {/* Tooth 46 */}
        <g id="tooth-46" className={`tooth-group ${perioData[46]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(46)}>
          <path id="surface-46l" className="lower-jaw-surface" d="M218.2,22.3c-0.9-0.6-1.7-1.3-2.8-1.9c-4.3-2.2-6.5-2.2-10.6-2.4c-3-0.2-6,0.9-8,0.6c-1.9-0.2-6.3-2.2-9.9-3.5c-7.3-2.6-16-2.8-21.2,0.4L189,43.6L218.2,22.3z"/>
          <path id="surface-46b" className="lower-jaw-surface" d="M158.8,66c1.1,1.7,2.4,3.5,4.3,5.2c9.3,8.4,18.6,3.9,24.6,3.9c3.7,0,6.5-0.4,10.2-0.4c5.8,0,10.6-0.2,14.5-2.4l-23.3-28.5L158.8,66z"/>
          <path id="surface-46d" className="lower-jaw-surface" d="M165.7,15.6c-1.1,0.6-2.2,1.5-2.8,2.6c-3.2,4.3-1.9,13-3.9,20.7c-2.6,10.8-4.5,19.4-0.2,27L189,43.6L165.7,15.6z"/>
          <path id="surface-46m" className="lower-jaw-surface" d="M218.2,22.3L189,43.7l23.3,28.5c2.6-1.5,4.8-3.5,6.7-6.5c4.8-7.6-0.2-14.9,1.5-23.8C221.7,34.8,223.4,26.8,218.2,22.3z"/>
          <text x="189" y="44" className="tooth-lbl-svg">46</text>
        </g>

        {/* Tooth 45 */}
        <g id="tooth-45" className={`tooth-group ${perioData[45]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(45)}>
          <path id="surface-45l" className="lower-jaw-surface" d="M262.1,33.1c-1.3-1.3-2.6-2.4-4.3-3.3c-1.9-1.1-24-13.2-31.8,0.6l19.2,20.8L262.1,33.1z"/>
          <path id="surface-45b" className="lower-jaw-surface" d="M228.4,69.4c1.1,1.5,2.4,2.8,4.1,3.7c4.1,2.4,7.3,2.2,12.1,2.6c2.6,0.2,10.6,0.4,13-1.1c2.4-1.5,4.3-2.2,6-3.7l-18.4-19.7L228.4,69.4z"/>
          <path id="surface-45d" className="lower-jaw-surface" d="M226,30.5c-0.2,0.4-0.4,0.6-0.6,1.1c-2.2,4.5-3.9,13.8-2.2,19.9c1.5,5.6,1.5,13,5.2,17.9l16.9-18.1L226,30.5z"/>
          <path id="surface-45m" className="lower-jaw-surface" d="M245.2,51.3L263.6,71c0.6-0.4,1.1-1.1,1.7-1.7c5.6-7.1,5.2-26.6-3.2-36.1L245.2,51.3z"/>
          <text x="245" y="44" className="tooth-lbl-svg">45</text>
        </g>

        {/* Tooth 44 */}
        <g id="tooth-44" className={`tooth-group ${perioData[44]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(44)}>
          <path id="surface-44l" className="lower-jaw-surface" d="M304,34.6c-0.2-0.4-0.5-0.8-0.9-1.3c-7.1-9.5-17.9-5.2-23.1-0.7l12.3,14.9L304,34.6z"/>
          <path id="surface-44b" className="lower-jaw-surface" d="M274.8,67.5c8.9,8.9,23.3,13,29.6,7.6c1.9-1.7,3.5-4.1,4.5-6.9l-16.6-20.6L274.8,67.5z"/>
          <path id="surface-44d" className="lower-jaw-surface" d="M280,32.7c-5.2,4.5-4.3,9.9-6.5,16.2c-2.6,7.3-4.8,11.9,0.6,17.9c0.2,0.2,0.4,0.4,0.6,0.6l17.5-19.9L280,32.7z"/>
          <path id="surface-44m" className="lower-jaw-surface" d="M310.3,53.6c-1.5-7.1-2.4-13-6.3-19l-11.7,13l16.6,20.5C310.9,63.8,311.3,58.6,310.3,53.6z"/>
          <text x="294" y="44" className="tooth-lbl-svg">44</text>
        </g>

        {/* Tooth 43 */}
        <g id="tooth-43" className={`tooth-group ${perioData[43]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(43)}>
          <path id="surface-43l" className="lower-jaw-surface" d="M344.4,33.3c-0.2-0.2-0.5-0.5-0.9-0.9c-4.8-5-8.4-6.3-14.9-5.2c-2.8,0.4-4.3,1.3-6.5,3.5c-0.9,0.9-1.5,1.9-1.9,2.8l11.9,14L344.4,33.3z"/>
          <path id="surface-43b" className="lower-jaw-surface" d="M316.5,65.5c3.9,5.6,10.6,9,14.7,10.3c2.4,0.6,8.6,0.4,10.2,0.2c4.3-1.1,6.9-3.8,8.6-7.4l-17.9-21L316.5,65.5z"/>
          <path id="surface-43d" className="lower-jaw-surface" d="M320.2,33.5c-1.1,2.4-1.3,5-1.9,7.8c-1.7,6.9-6,10.6-4.8,17.5c0.4,2.6,1.5,4.8,3,6.7l15.6-17.9L320.2,33.5z"/>
          <path id="surface-43m" className="lower-jaw-surface" d="M351.1,48.2c-1.3-5.6-2.8-10.4-6.7-14.9l-12.3,14.3l17.9,21C352.8,63.1,352.8,55.2,351.1,48.2z"/>
          <text x="333" y="44" className="tooth-lbl-svg">43</text>
        </g>

        {/* Tooth 42 */}
        <g id="tooth-42" className={`tooth-group ${perioData[42]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(42)}>
          <path id="surface-42l" className="lower-jaw-surface" d="M378.5,46.5c-0.6-0.9-1.5-1.9-2.4-2.8c-0.9-1.1-1.5-4.8-8-4.8c-6.7,0-5.8,5.6-7.3,7.6c-0.2,0.2,8.9,10.8,8.9,10.8L378.5,46.5z"/>
          <path id="surface-42d" className="lower-jaw-surface" d="M360.8,46.5c-4.3,6.7-6,16.6-4.3,21.8c0.4,1.5,1.3,2.8,2.2,3.9l11-14.9L360.8,46.5z"/>
          <path id="surface-42b" className="lower-jaw-surface" d="M358.7,72.2c2.8,3.2,7.6,4.5,12.5,4.5c4.5,0,8.3-0.9,11.5-4.1c-0.5-0.5-13-15.3-13-15.3L358.7,72.2z"/>
          <path id="surface-42m" className="lower-jaw-surface" d="M385.4,61.4c-1.1-5.4-3.5-9.9-6.9-14.9l-8.9,10.8l13,15.3C385.3,69.2,386.1,64.7,385.4,61.4z"/>
          <text x="372" y="44" className="tooth-lbl-svg">42</text>
        </g>

        {/* Tooth 41 */}
        <g id="tooth-41" className={`tooth-group ${perioData[41]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(41)}>
          <path id="surface-41l" className="lower-jaw-surface" d="M408.6,47.8c-0.2-0.2-0.4-0.6-0.4-0.9c-0.6-0.9-0.9-4.5-6.9-5c-6-0.6-5.8,4.1-7.1,5.6c-0.2,0.2-0.2,0.4-0.4,0.6l7.3,9.5L408.6,47.8z"/>
          <path id="surface-41b" className="lower-jaw-surface" d="M389.8,72.4c2.4,2.8,6.3,4.1,10.4,4.3c4.8,0.2,10.4,0,13.2-3.5l-12.3-15.6L389.8,72.4z"/>
          <path id="surface-41d" className="lower-jaw-surface" d="M393.7,48.2c-4.5,5.6-7.3,14.7-6.3,19.4c0.4,1.9,1.3,3.5,2.4,4.8L401,57.7L393.7,48.2z"/>
          <path id="surface-41m" className="lower-jaw-surface" d="M414.6,64c-1.1-5.6-2.6-10.6-6-16.2l-7.6,9.9l12.3,15.6C414.8,71.4,415.7,68.5,414.6,64z"/>
          <text x="403" y="44" className="tooth-lbl-svg">41</text>
        </g>

        {/* Tooth 31 */}
        <g id="tooth-31" className={`tooth-group ${perioData[31]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(31)}>
          <path id="surface-31l" className="lower-jaw-surface" d="M423.5,47.2c0.2-0.2,0.4-0.6,0.4-0.9c0.6-0.9,0.9-4.5,6.9-5c6-0.6,5.8,4.1,7.1,5.6c0.2,0.2,0.2,0.4,0.4,0.6L431,57L423.5,47.2z"/>
          <path id="surface-31b" className="lower-jaw-surface" d="M442.3,71.8c-2.4,2.8-6.3,4.1-10.4,4.3c-4.8,0.2-10.4,0-13.2-3.5L431,57L442.3,71.8z"/>
          <path id="surface-31d" className="lower-jaw-surface" d="M438.4,47.6c4.5,5.6,7.3,14.7,6.3,19.4c-0.4,1.9-1.3,3.5-2.4,4.8l-11.2-14.7L438.4,47.6z"/>
          <path id="surface-31m" className="lower-jaw-surface" d="M417.5,63.4c1.1-5.6,2.6-10.6,6-16.2l7.6,9.9l-12.3,15.6C417.3,70.7,416.4,67.9,417.5,63.4z"/>
          <text x="430" y="44" className="tooth-lbl-svg">31</text>
        </g>

        {/* Tooth 32 */}
        <g id="tooth-32" className={`tooth-group ${perioData[32]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(32)}>
          <path id="surface-32l" className="lower-jaw-surface" d="M453.6,45.9c0.6-0.9,1.5-1.9,2.4-2.8c0.9-1.1,1.5-4.8,8-4.8c6.7,0,5.8,5.6,7.3,7.6c0.2,0.2-8.9,10.8-8.9,10.8L453.6,45.9z"/>
          <path id="surface-32b" className="lower-jaw-surface" d="M473.4,71.6c-2.8,3.2-7.6,4.5-12.5,4.5c-4.5,0-8.3-0.9-11.5-4.1c0.5-0.5,13-15.3,13-15.3L473.4,71.6z"/>
          <path id="surface-32d" className="lower-jaw-surface" d="M471.3,45.9c4.3,6.7,6,16.6,4.3,21.8c-0.4,1.5-1.3,2.8-2.2,3.9l-11-14.9L471.3,45.9z"/>
          <path id="surface-32m" className="lower-jaw-surface" d="M446.6,60.8c1.1-5.4,3.5-9.9,6.9-14.9l8.9,10.8l-13,15.3C446.8,68.5,446,64,446.6,60.8z"/>
          <text x="462" y="44" className="tooth-lbl-svg">32</text>
        </g>

        {/* Tooth 33 */}
        <g id="tooth-33" className={`tooth-group ${perioData[33]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(33)}>
          <path id="surface-33d" className="lower-jaw-surface" d="M511.9,32.9c1.1,2.4,1.3,5,1.9,7.8c1.7,6.9,6,10.6,4.8,17.5c-0.4,2.6-1.5,4.8-3,6.7L500,47L511.9,32.9z"/>
          <path id="surface-33l" className="lower-jaw-surface" d="M487.7,32.7c0.2-0.2,0.5-0.5,0.9-0.9c4.8-5,8.4-6.3,14.9-5.2c2.8,0.4,4.3,1.3,6.5,3.5c0.9,0.9,1.5,1.9,1.9,2.8l-11.9,14L487.7,32.7z"/>
          <path id="surface-33b" className="lower-jaw-surface" d="M515.6,64.9c-3.9,5.6-10.6,9-14.7,10.3c-2.4,0.6-8.6,0.4-10.2,0.2c-4.3-1.1-6.9-3.8-8.6-7.4L500,47L515.6,64.9z"/>
          <path id="surface-33m" className="lower-jaw-surface" d="M481,47.6c1.3-5.6,2.8-10.4,6.7-14.9L500,47l-17.9,21C479.3,62.5,479.3,54.5,481,47.6z"/>
          <text x="501" y="44" className="tooth-lbl-svg">33</text>
        </g>

        {/* Tooth 34 */}
        <g id="tooth-34" className={`tooth-group ${perioData[34]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(34)}>
          <path id="surface-34l" className="lower-jaw-surface" d="M528.1,34c0.2-0.4,0.5-0.8,0.9-1.3c7.1-9.5,17.9-5.2,23.1-0.7l-12.3,14.9L528.1,34z"/>
          <path id="surface-34b" className="lower-jaw-surface" d="M557.3,66.8c-8.9,8.9-23.3,13-29.6,7.6c1.9-1.7,3.5-4.1,4.5-6.9L539.8,47L557.3,66.8z"/>
          <path id="surface-34d" className="lower-jaw-surface" d="M552.1,32c5.2,4.5,4.3,9.9,6.5,16.2c2.6,7.3,4.8,11.9-0.6,17.9c-0.2,0.2-0.4,0.4-0.6,0.6l-17.5-19.9L552.1,32z"/>
          <path id="surface-34m" className="lower-jaw-surface" d="M521.8,53c1.5-7.1,2.4-13,6.3-19l11.7,13l-16.6,20.5C521.2,63.2,520.8,58,521.8,53z"/>
          <text x="540" y="44" className="tooth-lbl-svg">34</text>
        </g>

        {/* Tooth 35 */}
        <g id="tooth-35" className={`tooth-group ${perioData[35]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(35)}>
          <path id="surface-35l" className="lower-jaw-surface" d="M570,32.5c1.3-1.3,2.6-2.4,4.3-3.3c1.9-1.1,24-13.2,31.8,0.6l-19.2,20.8L570,32.5z"/>
          <path id="surface-35b" className="lower-jaw-surface" d="M603.7,68.8c-1.1,1.5-2.4,2.8-4.1,3.7c-4.1,2.4-7.3,2.2-12.1,2.6c-2.6,0.2-10.6,0.4-13-1.1s-4.3-2.2-6-3.7l18.4-19.7L603.7,68.8z"/>
          <path id="surface-35d" className="lower-jaw-surface" d="M606.1,29.9c0.2,0.4,0.4,0.6,0.6,1.1c2.2,4.5,3.9,13.8,2.2,19.9c-1.5,5.6-1.5,13-5.2,17.9l-16.8-18.2L606.1,29.9z"/>
          <path id="surface-35m" className="lower-jaw-surface" d="M586.9,50.6l-18.4,19.7c-0.6-0.4-1.1-1.1-1.7-1.7c-5.6-7.1-5.2-26.6-3.2-36.1L586.9,50.6z"/>
          <text x="588" y="44" className="tooth-lbl-svg">35</text>
        </g>

        {/* Tooth 36 */}
        <g id="tooth-36" className={`tooth-group ${perioData[36]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(36)}>
          <path id="surface-36l" className="lower-jaw-surface" d="M613.9,21.7c0.9-0.6,1.7-1.3,2.8-1.9c4.3-2.2,6.5-2.2,10.6-2.4c3-0.2,6,0.9,8,0.6c1.9-0.2,6.3-2.2,9.9-3.5c7.3-2.6,16-2.8,21.2,0.4L643.1,43L613.9,21.7z"/>
          <path id="surface-36b" className="lower-jaw-surface" d="M673.3,65.3c-1.1,1.7-2.4,3.5-4.3,5.2c-9.3,8.4-18.6,3.9-24.6,3.9c-3.7,0-6.5-0.4-10.2-0.4c-5.8,0-10.6-0.2-14.5-2.4L643,43.1L673.3,65.3z"/>
          <path id="surface-36d" className="lower-jaw-surface" d="M666.4,15c1.1,0.6,2.2,1.5,2.8,2.6c3.2,4.3,1.9,13,3.9,20.7c2.6,10.8,4.5,19.4,0.2,27L643.1,43L666.4,15z"/>
          <path id="surface-36m" className="lower-jaw-surface" d="M613.9,21.7l29.2,21.4l-23.4,28.5c-2.6-1.5-4.8-3.5-6.7-6.5c-4.8-7.6,0.2-14.9-1.5-23.8C610.4,34.2,608.7,26.2,613.9,21.7z"/>
          <text x="643" y="44" className="tooth-lbl-svg">36</text>
        </g>

        {/* Tooth 37 */}
        <g id="tooth-37" className={`tooth-group ${perioData[37]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(37)}>
          <path id="surface-37l" className="lower-jaw-surface" d="M687.3,7.6c7.1-2.8,12.7,1.5,16.6,1.3c6.3-0.6,11.2-4.5,17.5-3.7c4.3,0.6,8,1.7,11.2,3.7l-19.3,27.7L687.3,7.6z"/>
          <path id="surface-37b" className="lower-jaw-surface" d="M739.8,66.2c-0.4,0.4-1.1,0.6-1.5,1.1c-5.4,4.1-13.4,2.2-17.5,1.5c-8.4,1.7-16.9,8-26.6,3.9c-1.7-0.6-3-1.7-4.5-2.6l23.5-33.5L739.8,66.2z"/>
          <path id="surface-37d" className="lower-jaw-surface" d="M732.7,8.9c3.5,2.2,6,5.4,7.6,10.2c3,8.9,0.9,13.2,2.8,22.3c1.3,6.7,2.6,12.3-0.6,18.8c-0.9,2.6-1.9,4.3-3.9,6l-26.5-29.6L732.7,8.9z"/>
          <path id="surface-37m" className="lower-jaw-surface" d="M686.5,8.1c-0.3-0.1-0.4-0.3-0.9-0.4l-25.9,29l23.5,33.5c3.9-2.6,6.5-5.8,8.9-10.6c4.1-8.9,5.4-20.3,4.1-31.8C677.6,19.3,678.5,11.7,686.5,8.1z"/>
          <text x="713" y="44" className="tooth-lbl-svg">37</text>
        </g>

        {/* Tooth 38 */}
        <g id="tooth-38" className={`tooth-group ${perioData[38]?.present === false ? 'missing' : ''}`} onClick={() => togglePerioPresent && togglePerioPresent(38)}>
          <path id="surface-38l" className="lower-jaw-surface" d="M753.2,12.2c1.5-1.1,3.2-2.2,5.2-2.8c6.5-2.4,8.9,0-14,0.6c-7.1,0.9-14.5-6.7-25.3,5.6l-21.2,22.3L753.2,12.2z"/>
          <path id="surface-38b" className="lower-jaw-surface" d="M797.5,60.8c-3.7,3.2-8,5.4-13.8,7.6c-11.5,4.3-25.1,3.7-31.1-5.2l24-25.3L797.5,60.8z"/>
          <path id="surface-38d" className="lower-jaw-surface" d="M797.7,15.6c1.1,1.3,2.2,2.6,3.2,4.1c4.5,6.3,2.6,13.2,4.1,19c1.7,6,1.3,11.2-2.4,16.4c-1.7,2.4-3.5,4.1-5.2,5.6l-21-22.9L797.7,15.6z"/>
          <path id="surface-38m" className="lower-jaw-surface" d="M753.2,12.2l23.3,25.7l-24,25.3c-0.6-0.9-1.3-1.9-1.7-3.2C744.8,44.1,740.7,21.9,753.2,12.2z"/>
          <text x="778" y="44" className="tooth-lbl-svg">38</text>
        </g>
      </g>
    </svg>
  );
}
