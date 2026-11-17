/**
 * Marva Technologies emblem.
 * Pure SVG + CSS animation (no images, so it stays razor sharp at any size):
 *  - a light arc with a tapering tail orbiting the ring
 *  - the "M" monogram draws itself in on load
 *  - an accent node with a soft pulse at the heart of the M
 */
export default function BrandMark() {
  return (
    <svg className="bm" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bm-cream" x1="12" y1="14" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E8E2D9" />
        </linearGradient>
        <linearGradient id="bm-ember" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F2A88B" />
          <stop offset="1" stopColor="#D97757" />
        </linearGradient>
        <radialGradient id="bm-disc" cx="50%" cy="38%" r="70%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".10" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".02" />
        </radialGradient>
      </defs>

      {/* base disc + hairline ring */}
      <circle cx="24" cy="24" r="21.5" fill="url(#bm-disc)" />
      <circle cx="24" cy="24" r="21.5" stroke="#ffffff" strokeOpacity=".2" strokeWidth="1" />

      {/* orbiting light arc: stacked dashes share one head to create a fading tail */}
      <g className="bm-orbit">
        <circle cx="24" cy="24" r="21.5" stroke="url(#bm-ember)" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".22" strokeDasharray="45.93 200" strokeDashoffset="0" />
        <circle cx="24" cy="24" r="21.5" stroke="url(#bm-ember)" strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".45" strokeDasharray="32.42 200" strokeDashoffset="-13.51" />
        <circle cx="24" cy="24" r="21.5" stroke="url(#bm-ember)" strokeWidth="2" strokeLinecap="round" strokeOpacity=".75" strokeDasharray="18.91 200" strokeDashoffset="-27.02" />
        <circle cx="24" cy="24" r="21.5" stroke="#FFD9C7" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="5.4 200" strokeDashoffset="-40.53" />
        <circle className="bm-head" cx="12.48" cy="42.15" r="1.7" fill="#FFE9DD" />
      </g>

      {/* monogram */}
      <path
        className="bm-m"
        d="M15 32.5V16.5L24 26.5L33 16.5V32.5"
        pathLength="1"
        stroke="url(#bm-cream)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="bm-halo" cx="24" cy="26.5" r="2" fill="#D97757" />
      <circle className="bm-node" cx="24" cy="26.5" r="2" fill="url(#bm-ember)" />
    </svg>
  );
}
