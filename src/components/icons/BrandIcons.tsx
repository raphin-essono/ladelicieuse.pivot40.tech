type IconProps = { className?: string };

// ─── Avantages ────────────────────────────────────────────────────────────────

export function FreshIngredientsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#f0fdf4" />
      {/* Plate ring */}
      <circle cx="32" cy="35" r="19" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
      {/* Large leaf */}
      <path
        d="M32 20 C24 20 15 26 15 36 C15 36 22 30 32 30 C42 30 49 36 49 36 C49 26 40 20 32 20Z"
        fill="#22c55e"
      />
      <path d="M32 20 L32 36" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 28 C26 27 20 28 15 36" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M32 28 C38 27 44 28 49 36" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Tomato */}
      <circle cx="24" cy="42" r="6.5" fill="#ef4444" />
      <circle cx="23.5" cy="41" r="4" fill="#f87171" />
      <path d="M23.5 36 L23 34 M24 36 L24.5 34" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cucumber */}
      <ellipse cx="40" cy="44" rx="5" ry="3" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
      <path d="M40 44 L40 41" stroke="#22c55e" strokeWidth="0.8" strokeLinecap="round" />
      {/* Water drop */}
      <path d="M51 16 Q53 12 55 16 Q55 19.5 53 20 Q51 19.5 51 16Z" fill="#93c5fd" opacity="0.85" />
    </svg>
  );
}

export function CustomOrderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#f0fdf4" />
      {/* Bowl shadow */}
      <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="#22c55e" opacity="0.12" />
      {/* Bowl body */}
      <path d="M13 31 Q13 52 32 52 Q51 52 51 31Z" fill="#ffffff" stroke="#2d6a4f" strokeWidth="1.8" />
      {/* Bowl rim */}
      <ellipse cx="32" cy="31" rx="19" ry="5.5" fill="#d1fae5" stroke="#2d6a4f" strokeWidth="1.8" />
      {/* Lettuce layer */}
      <path d="M19 31 Q22 24 32 22 Q42 24 45 31 Q38 35 32 35 Q26 35 19 31Z" fill="#4ade80" opacity="0.65" />
      {/* Avocado half */}
      <path d="M20 37 Q20 30 27 28 Q34 28 34 34 Q34 40 27 42 Q20 42 20 37Z" fill="#86efac" />
      <ellipse cx="27" cy="36" rx="3.5" ry="4.5" fill="#fde68a" />
      <circle cx="27" cy="36" r="2" fill="#d97706" />
      {/* Tomato slice */}
      <circle cx="40" cy="37" r="6.5" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
      <path d="M33.5 37 L46.5 37 M40 30.5 L40 43.5" stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
      <circle cx="40" cy="37" r="1.5" fill="#fff0ee" />
      {/* Plus / customise badge */}
      <circle cx="51" cy="15" r="8" fill="#2d6a4f" />
      <path d="M51 11 L51 19 M47 15 L55 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FastDeliveryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#f0fdf4" />
      {/* Road line */}
      <path d="M8 50 L56 50" stroke="#d1fae5" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
      {/* Speed lines */}
      <path d="M10 36 L20 36" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 41 L19 41" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M9 31 L17 31" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      {/* Delivery bag */}
      <rect x="42" y="20" width="16" height="17" rx="3" fill="#ef4444" />
      <path d="M44 20 L44 17 Q50 14 56 17 L56 20" stroke="#b91c1c" strokeWidth="1.2" fill="none" />
      <rect x="45" y="23.5" width="9" height="2" rx="1" fill="#fca5a5" />
      <rect x="45" y="27.5" width="6" height="2" rx="1" fill="#fca5a5" opacity="0.6" />
      {/* Scooter body */}
      <path d="M20 38 Q24 28 34 27 L44 27 Q47 27 48 31 L48 42 Q45 46 38 46 L28 46 Q21 46 20 38Z" fill="#2d6a4f" />
      {/* Windshield */}
      <path d="M26 33 Q28 27 36 27 L42 27 Q45 28 46 32 L46 34 L26 34Z" fill="#95d5b2" opacity="0.55" />
      {/* Seat */}
      <path d="M28 27 L42 27 Q44 27 44 29 L24 29 Q24 27 28 27Z" fill="#1a3d26" />
      {/* Front wheel */}
      <circle cx="22" cy="46" r="8" fill="#1a3d26" stroke="#52b788" strokeWidth="1.8" />
      <circle cx="22" cy="46" r="4.5" fill="#2d6a4f" />
      <circle cx="22" cy="46" r="1.8" fill="#95d5b2" />
      {/* Back wheel */}
      <circle cx="44" cy="46" r="7.5" fill="#1a3d26" stroke="#52b788" strokeWidth="1.8" />
      <circle cx="44" cy="46" r="4" fill="#2d6a4f" />
      <circle cx="44" cy="46" r="1.5" fill="#95d5b2" />
      {/* Handlebar */}
      <path d="M18 35 Q14 33 13 36 L13 39" stroke="#1a3d26" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="13" cy="39" r="1.8" fill="#52b788" />
      {/* Clock badge */}
      <circle cx="56" cy="13" r="7.5" fill="#fafff5" stroke="#2d6a4f" strokeWidth="1.8" />
      <path d="M56 9 L56 13 L59 13" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="56" cy="13" r="1" fill="#ef4444" />
    </svg>
  );
}

export function NutritionTrackingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#fff1f2" />
      {/* Heart outer glow */}
      <path
        d="M32 54 Q7 40 7 22 Q7 10 18 10 Q26 10 32 20 Q38 10 46 10 Q57 10 57 22 Q57 40 32 54Z"
        fill="#fee2e2"
        opacity="0.7"
      />
      {/* Heart fill */}
      <path
        d="M32 50 Q9 37 9 22 Q9 13 19 13 Q27 13 32 23 Q37 13 45 13 Q55 13 55 22 Q55 37 32 50Z"
        fill="#ef4444"
      />
      <path
        d="M32 46 Q12 34 12 22 Q12 15 21 15 Q28 15 32 25 Q36 15 43 15 Q52 15 52 22 Q52 34 32 46Z"
        fill="#f87171"
      />
      {/* EKG pulse line */}
      <polyline
        points="9,29 16,29 20,20 24,38 28,25 32,33 37,29 55,29"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Nutrition bar chart (replaces <text> element) */}
      <rect x="15" y="42" width="4" height="10" rx="2" fill="white" opacity="0.35" />
      <rect x="22" y="46" width="4" height="6" rx="2" fill="white" opacity="0.35" />
      <rect x="29" y="43" width="4" height="9" rx="2" fill="white" opacity="0.35" />
      <rect x="36" y="45" width="4" height="7" rx="2" fill="white" opacity="0.35" />
      <rect x="43" y="42" width="4" height="10" rx="2" fill="white" opacity="0.35" />
      {/* Apple accent */}
      <circle cx="53" cy="10" r="6.5" fill="#22c55e" />
      <circle cx="52" cy="9" r="3" fill="#4ade80" opacity="0.5" />
      <path d="M53 6.5 L53 4" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M53 6.5 Q55 4.5 57 6" stroke="#16a34a" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Abonnements ──────────────────────────────────────────────────────────────

export function EssentielIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#f0fdf4" />
      {/* Soil */}
      <ellipse cx="32" cy="52" rx="12" ry="4" fill="#a16207" opacity="0.35" />
      <ellipse cx="32" cy="52" rx="8" ry="2.5" fill="#ca8a04" opacity="0.3" />
      {/* Main stem */}
      <path d="M32 52 L32 28" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M32 40 Q20 36 14 24 Q22 20 32 34Z" fill="#4ade80" />
      <path d="M32 38 Q22 34 16 24" stroke="#16a34a" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Right leaf */}
      <path d="M32 44 Q44 40 50 28 Q42 24 32 38Z" fill="#22c55e" />
      <path d="M32 42 Q42 38 48 28" stroke="#16a34a" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Small upper leaflet */}
      <path d="M32 34 Q24 30 21 24 Q27 22 32 31Z" fill="#86efac" opacity="0.85" />
      {/* Top bud */}
      <circle cx="32" cy="25" r="5.5" fill="#4ade80" />
      <path d="M29.5 23 Q32 18 34.5 23" fill="#86efac" />
      <circle cx="32" cy="23" r="1.8" fill="#d1fae5" opacity="0.7" />
      {/* Water drop */}
      <path d="M14 18 Q15.5 14 17 18 Q17 21 15.5 21.5 Q14 21 14 18Z" fill="#93c5fd" opacity="0.9" />
      {/* Sun ray */}
      <line x1="49" y1="13" x2="53" y2="9" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="53" y1="17" x2="58" y2="15" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="51" y1="22" x2="56" y2="22" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function VitaliteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#fffbeb" />
      {/* Glow rings */}
      <circle cx="32" cy="32" r="22" fill="#fef3c7" opacity="0.5" />
      <circle cx="32" cy="32" r="14" fill="#fde68a" opacity="0.3" />
      {/* Lightning bolt */}
      <path d="M38 10 L22 34 L32 34 L26 56 L42 30 L32 30Z" fill="#f59e0b" />
      {/* Bolt highlight */}
      <path d="M36 15 L25 32 L35 32 L30 48 L40 28 L30 28Z" fill="#fde68a" opacity="0.6" />
      {/* Energy sparkle top-right */}
      <path
        d="M52 13 L53.2 9.6 L54.4 13 L57.8 14.2 L54.4 15.4 L53.2 18.8 L52 15.4 L48.6 14.2Z"
        fill="#fbbf24"
      />
      {/* Energy sparkle bottom-left */}
      <path
        d="M9 35 L9.9 32 L10.8 35 L13.8 35.9 L10.8 36.8 L9.9 39.8 L9 36.8 L6 35.9Z"
        fill="#f59e0b"
        opacity="0.8"
      />
      {/* Accent dots */}
      <circle cx="55" cy="36" r="2.5" fill="#fbbf24" opacity="0.65" />
      <circle cx="11" cy="20" r="2" fill="#f59e0b" opacity="0.55" />
      <circle cx="57" cy="48" r="2" fill="#fde68a" opacity="0.6" />
      {/* Radiant lines */}
      <line x1="55" y1="22" x2="59" y2="18" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <line x1="9" y1="43" x2="5" y2="47" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

export function PremiumIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Background */}
      <circle cx="32" cy="32" r="28" fill="#fffbeb" />
      {/* Crown shadow */}
      <ellipse cx="32" cy="56" rx="16" ry="3.5" fill="#92400e" opacity="0.12" />
      {/* Crown base band */}
      <path d="M15 44 L49 44 L49 52 Q49 56 45 56 L19 56 Q15 56 15 52Z" fill="#b45309" />
      <path d="M15 44 L49 44 L49 48 L15 48Z" fill="#d97706" />
      {/* Crown body */}
      <path d="M15 44 L15 25 L24 37 L32 13 L40 37 L49 25 L49 44Z" fill="#f59e0b" />
      {/* Crown shading */}
      <path d="M19 44 L19 28 L26 38 L32 17 L38 38 L45 28 L45 44Z" fill="#fbbf24" opacity="0.4" />
      {/* Crown outline */}
      <path
        d="M15 44 L15 25 L24 37 L32 13 L40 37 L49 25 L49 44"
        stroke="#b45309"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Left peak gem */}
      <circle cx="15" cy="25" r="4.5" fill="#7c3aed" />
      <circle cx="14.5" cy="24" r="2.2" fill="#a78bfa" />
      {/* Center peak gem (ruby) */}
      <circle cx="32" cy="13" r="5.5" fill="#dc2626" />
      <circle cx="31.5" cy="12" r="2.8" fill="#f87171" />
      <path d="M30 11.5 L31.5 10 L33 11.5 L31.5 14Z" fill="#fca5a5" opacity="0.55" />
      {/* Right peak gem */}
      <circle cx="49" cy="25" r="4.5" fill="#1d4ed8" />
      <circle cx="48.5" cy="24" r="2.2" fill="#60a5fa" />
      {/* Band gems */}
      <circle cx="23" cy="50" r="3" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
      <circle cx="32" cy="50" r="3" fill="#86efac" stroke="#16a34a" strokeWidth="0.8" />
      <circle cx="41" cy="50" r="3" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
      {/* Stars */}
      <path d="M7 19 L8 15.8 L9 19 L12.2 20 L9 21 L8 24.2 L7 21 L3.8 20Z" fill="#fbbf24" />
      <path d="M56 21 L56.8 18.4 L57.6 21 L60.2 21.8 L57.6 22.6 L56.8 25.2 L56 22.6 L53.4 21.8Z" fill="#fbbf24" opacity="0.8" />
    </svg>
  );
}
