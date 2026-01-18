import Link from 'next/link';

function PepperShaker() {
  return (
    <svg
      width="14"
      height="22"
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      {/* Cap with holes */}
      <rect x="12" y="0" width="16" height="10" rx="3" fill="#e5e5e5" />
      <circle cx="15" cy="5" r="1.5" fill="#999" />
      <circle cx="20" cy="5" r="1.5" fill="#999" />
      <circle cx="25" cy="5" r="1.5" fill="#999" />
      {/* Neck */}
      <rect x="14" y="10" width="12" height="6" fill="#d4d4d4" />
      {/* Body - classic cafe style */}
      <path d="M10 16 L12 54 L28 54 L30 16 Z" fill="#f5f5f5" />
      <path d="M12 16 L13 52 L27 52 L28 16 Z" fill="#ffffff" />
      {/* Label area */}
      <rect x="14" y="28" width="12" height="16" rx="1" fill="#1a1a1a" />
      <text x="20" y="39" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">P</text>
    </svg>
  );
}

export default function OxoStrip() {
  return (
    <Link
      href="/ban-the-bovril"
      className="block bg-[#1a1a1a] text-white overflow-hidden hover:bg-[#2a2a2a] transition-colors cursor-pointer"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 py-2 text-sm">
          <span className="text-white">Matchday Rule #1:</span>
          <span className="font-black" style={{ color: '#C41E3A' }}>OXO</span>
          <span className="text-white">+</span>
          <PepperShaker />
          <span className="text-white">=</span>
          <span className="text-celtic-yellow font-semibold">Perfection</span>
          <span className="hidden sm:inline text-white/50 ml-2">|</span>
          <span className="hidden sm:inline text-white">#PassThePepper</span>
        </div>
      </div>
    </Link>
  );
}
