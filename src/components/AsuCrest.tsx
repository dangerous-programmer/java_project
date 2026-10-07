import React from 'react';

export const AsuCrest: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-label="Ain Shams University Faculty of Science Crest"
    >
      {/* Outer circle with institutional green & gold border */}
      <circle cx="50" cy="50" r="47" fill="#064E3B" stroke="#D97706" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="43" fill="#047857" stroke="#FDE68A" strokeWidth="1" />

      {/* Sun rays of Ain Shams (Ain Shams means Eye of the Sun / Heliopolis) */}
      <path
        d="M50 12 L53 22 L63 15 L59 25 L71 21 L64 30 L76 30 L66 37 L77 40 L65 44 L75 49 L62 50 L75 51 L65 56 L77 60 L66 63 L76 70 L64 70 L71 79 L59 75 L63 85 L53 78 L50 88 L47 78 L37 85 L41 75 L29 79 L36 70 L24 70 L34 63 L23 60 L35 56 L25 51 L38 50 L25 49 L35 44 L23 40 L34 37 L24 30 L36 30 L29 21 L41 25 L37 15 L47 22 Z"
        fill="#F59E0B"
        opacity="0.25"
      />

      {/* Central White Disc for Scientific Symbols */}
      <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke="#065F46" strokeWidth="1.5" />

      {/* Atomic Orbital rings symbolizing Faculty of Science */}
      <ellipse cx="50" cy="50" rx="22" ry="7" transform="rotate(-30 50 50)" stroke="#059669" strokeWidth="1.2" strokeDasharray="1 1" />
      <ellipse cx="50" cy="50" rx="22" ry="7" transform="rotate(30 50 50)" stroke="#059669" strokeWidth="1.2" strokeDasharray="1 1" />

      {/* Ancient Obelisk & Sun of Ain Shams */}
      <path d="M48 28 L52 28 L53 58 L47 58 Z" fill="#D97706" />
      <polygon points="50,23 47,28 53,28" fill="#B45309" />

      {/* Open Book of Academic Knowledge */}
      <path
        d="M36 56 C42 54 48 56 50 58 C52 56 58 54 64 56 L64 68 C58 66 52 68 50 70 C48 68 42 66 36 68 Z"
        fill="#064E3B"
      />
      <path d="M50 58 L50 70" stroke="#FDE68A" strokeWidth="1" />

      {/* Nucleus dot */}
      <circle cx="50" cy="46" r="3" fill="#DC2626" />
    </svg>
  );
};
