import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ban the Bovril | Pass the Pepper',
  description: 'At Cwmbran Celtic, we serve OXO. Bovril? Never heard of it. Pass the pepper.',
  openGraph: {
    title: 'Ban the Bovril | Cwmbran Celtic AFC',
    description: 'At Cwmbran Celtic, we serve OXO. Bovril? Never heard of it. Pass the pepper.',
  },
};

// Campaign colors
const colors = {
  celticBlue: '#1e3a5f',
  celticBlueDark: '#0a1628',
  celticYellow: '#facc15',
  oxoRed: '#C41E3A',
  bovrilBrown: '#4A3728',
  pepperBlack: '#1a1a1a',
  creamBackground: '#FFFEF5',
};

// OXO Logo Component
function OxoLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  };

  return (
    <span
      className={`font-black tracking-tight ${sizes[size]}`}
      style={{
        color: colors.oxoRed,
        fontFamily: 'Arial Black, Helvetica Neue, sans-serif',
        letterSpacing: '-0.05em',
      }}
    >
      OXO
    </span>
  );
}

// Crossed-out Bovril Component
function BovrilBanned({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <span
      className={`font-black line-through opacity-60 ${sizes[size]}`}
      style={{
        color: colors.bovrilBrown,
        fontFamily: 'Arial Black, Helvetica Neue, sans-serif',
      }}
    >
      BOVRIL
    </span>
  );
}

// Campaign Badge Component
function CampaignBadge() {
  return (
    <div
      className="rounded-full border-4 p-4 text-center inline-block"
      style={{
        borderColor: colors.oxoRed,
        background: 'white',
      }}
    >
      <div className="text-xs font-bold text-gray-500">OFFICIAL</div>
      <div
        className="text-2xl font-black"
        style={{ color: colors.oxoRed }}
      >
        OXO
      </div>
      <div className="text-xs font-bold text-gray-500">TERRITORY</div>
    </div>
  );
}

// Pepper Shaker SVG
function PepperShaker({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 40 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="12" y="0" width="16" height="8" rx="2" fill="#2d2d2d" />
      <rect x="14" y="8" width="12" height="6" fill="#3d3d3d" />
      <rect x="8" y="14" width="24" height="40" rx="3" fill="#1a1a1a" />
      <rect x="12" y="20" width="16" height="28" rx="2" fill="#333" />
      <circle cx="16" cy="26" r="1.5" fill="#555" />
      <circle cx="22" cy="24" r="1" fill="#444" />
      <circle cx="19" cy="30" r="1.5" fill="#555" />
      <circle cx="24" cy="32" r="1" fill="#444" />
      <circle cx="15" cy="35" r="1" fill="#555" />
      <circle cx="21" cy="38" r="1.5" fill="#444" />
      <circle cx="17" cy="42" r="1" fill="#555" />
      <circle cx="23" cy="40" r="1" fill="#444" />
      <circle cx="15" cy="4" r="1" fill="#111" />
      <circle cx="20" cy="4" r="1" fill="#111" />
      <circle cx="25" cy="4" r="1" fill="#111" />
    </svg>
  );
}

// Steaming Cup SVG
function SteamingCup({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 80 96"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="animate-steam">
        <path d="M25 15 Q30 5 25 -5" stroke="#ddd" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M40 10 Q45 0 40 -10" stroke="#ddd" strokeWidth="2" fill="none" opacity="0.6" style={{ animationDelay: '0.3s' }} />
        <path d="M55 15 Q60 5 55 -5" stroke="#ddd" strokeWidth="2" fill="none" opacity="0.6" style={{ animationDelay: '0.6s' }} />
      </g>
      <path d="M10 20 L15 85 L65 85 L70 20 Z" fill="white" stroke="#ccc" strokeWidth="2" />
      <path d="M70 35 Q90 35 90 55 Q90 75 70 75" fill="none" stroke="#ccc" strokeWidth="6" />
      <text x="40" y="60" textAnchor="middle" fontSize="18" fontWeight="bold" fill={colors.oxoRed} fontFamily="Arial Black">OXO</text>
      <circle cx="25" cy="25" r="1" fill="#333" />
      <circle cx="35" cy="22" r="1.5" fill="#222" />
      <circle cx="45" cy="24" r="1" fill="#333" />
      <circle cx="55" cy="23" r="1" fill="#222" />
      <circle cx="30" cy="27" r="1" fill="#333" />
      <circle cx="50" cy="26" r="1.5" fill="#222" />
    </svg>
  );
}

export default function BanTheBovrilPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="py-16 md:py-24 px-6 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${colors.celticBlue} 0%, ${colors.celticBlueDark} 100%)`,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round'%3E%3Cg transform='translate(25,25)'%3E%3Cline x1='-7' y1='-7' x2='7' y2='7'/%3E%3Ccircle cx='-8' cy='-8' r='2.5'/%3E%3Cline x1='5' y1='5' x2='5' y2='8'/%3E%3Cline x1='7' y1='7' x2='7' y2='9'/%3E%3Cline x1='7' y1='-7' x2='-7' y2='7'/%3E%3Ccircle cx='8' cy='-8' r='2.5'/%3E%3Cline x1='-5' y1='5' x2='-5' y2='8'/%3E%3Cline x1='-7' y1='7' x2='-7' y2='9'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <Image
            src="/images/club-logo.webp"
            alt="Cwmbran Celtic AFC"
            width={100}
            height={100}
            className="mx-auto mb-6"
          />

          <h1 className="text-white text-5xl md:text-7xl font-display uppercase mb-4">
            BAN THE BOVRIL
          </h1>

          <p className="text-white text-xl mb-8">
            At Cwmbran Celtic, we serve <span style={{ color: colors.oxoRed }} className="font-bold">OXO</span>. Always have. Always will.
          </p>

          <div className="bg-white rounded-xl p-6 md:p-8 inline-block shadow-2xl mb-8">
            <OxoLogo size="xl" />
            <div className="mt-4 flex items-center justify-center gap-3">
              <BovrilBanned size="md" />
              <span className="text-3xl">🚫</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['#BanTheBovril', '#PassThePepper', '#OXOTerritory'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm font-bold text-white"
                style={{ background: colors.oxoRed }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pass the Pepper Section */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-display uppercase mb-2"
            style={{ color: colors.pepperBlack }}
          >
            PASS THE PEPPER
          </h2>
          <p className="text-gray-500 font-semibold text-lg mb-8">Matchday Rule #1</p>

          {/* The equation */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-10 flex-wrap">
            <div
              className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-2"
              style={{ borderColor: colors.oxoRed }}
            >
              <OxoLogo size="lg" />
            </div>
            <span className="text-4xl text-gray-400">+</span>
            <div
              className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-2 flex items-center justify-center"
              style={{ borderColor: colors.pepperBlack }}
            >
              <PepperShaker size={60} className="hover:animate-shake" />
            </div>
            <span className="text-4xl text-gray-400">=</span>
            <div className="bg-celtic-yellow rounded-xl p-4 md:p-6 shadow-lg">
              <SteamingCup size={70} />
            </div>
          </div>

          <p className="text-gray-700 text-lg max-w-xl mx-auto mb-4">
            At the Avondale Motor Park Arena, matchday means one thing: a steaming cup of OXO with a
            shake of pepper. It&apos;s tradition. It&apos;s the Celtic way.
          </p>

          <p className="text-gray-500 italic">
            Bovril? That&apos;s banned in these parts.
          </p>
        </div>
      </section>

      {/* Matchday Menu Section */}
      <section
        className="py-16 md:py-20 px-6"
        style={{ background: colors.creamBackground }}
      >
        <div className="max-w-md mx-auto">
          <div
            className="rounded-xl overflow-hidden shadow-xl"
            style={{ border: `4px solid ${colors.celticBlue}` }}
          >
            {/* Header */}
            <div
              className="py-3 px-4 flex items-center justify-center gap-3"
              style={{ background: colors.celticBlue }}
            >
              <Image
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic AFC"
                width={35}
                height={35}
              />
              <span className="text-white font-bold">CELTIC PARK TEA HUT</span>
            </div>

            {/* Menu items */}
            <div className="p-5 bg-white space-y-3">
              <h3
                className="text-2xl font-display uppercase text-center mb-4"
                style={{ color: colors.celticBlue }}
              >
                MATCHDAY MENU
              </h3>

              {/* OXO */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border-2"
                style={{ borderColor: colors.oxoRed }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☕</span>
                  <div>
                    <OxoLogo size="sm" />
                    <span className="text-xs text-gray-500 block">+ pepper on request</span>
                  </div>
                </div>
                <span className="text-green-600 font-bold text-lg">✓ YES</span>
              </div>

              {/* Pepper */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <PepperShaker size={24} />
                  <div>
                    <span className="font-bold text-gray-800">Pepper</span>
                    <span className="text-xs text-gray-500 block">for your OXO</span>
                  </div>
                </div>
                <span className="font-bold text-celtic-yellow bg-celtic-blue px-3 py-1 rounded">FREE</span>
              </div>

              {/* Bovril */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 opacity-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚫</span>
                  <div>
                    <BovrilBanned size="sm" />
                    <span className="text-xs text-gray-400 block">banned substance</span>
                  </div>
                </div>
                <span className="text-red-500 font-bold text-lg">✗ NO</span>
              </div>
            </div>

            {/* Footer */}
            <div
              className="py-3 text-center text-white font-bold"
              style={{ background: colors.celticBlue }}
            >
              &quot;Pass the Pepper&quot; 🌶️
            </div>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <CampaignBadge />
          </div>

          <h2 className="text-3xl font-display uppercase text-center text-celtic-dark mb-6">
            The OXO Story
          </h2>

          <div className="prose prose-lg mx-auto text-gray-700">
            <p>
              Some clubs serve Bovril. Not us.
            </p>

            <p>
              At Cwmbran Celtic, we&apos;ve always done things our own way. And that means OXO -
              proper beefy goodness in a cup, with a shake of pepper on top. Ask anyone who&apos;s
              stood on the terraces at the Avondale Motor Park Arena: there&apos;s nothing quite like
              a peppered OXO on a cold matchday.
            </p>

            <p>
              It started as just how we did things. Now it&apos;s a badge of honour. A point of pride.
              A small but meaningful part of what makes Cwmbran Celtic... Cwmbran Celtic.
            </p>

            <p className="text-center font-bold text-xl" style={{ color: colors.oxoRed }}>
              So next time you&apos;re at the tea hut, remember the golden rule:
            </p>

            <p className="text-center text-2xl font-display uppercase" style={{ color: colors.pepperBlack }}>
              Pass the Pepper.
            </p>
          </div>
        </div>
      </section>

      {/* Social CTA Section */}
      <section
        className="py-16 md:py-20 px-6 text-center text-white"
        style={{ background: colors.pepperBlack }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display uppercase mb-4">JOIN THE MOVEMENT</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Share your matchday OXO photos and spread the word.
          </p>

          <div className="flex justify-center gap-4 flex-wrap mb-8">
            {['#PassThePepper', '#BanTheBovril'].map((tag) => (
              <span
                key={tag}
                className="px-6 py-3 rounded-full text-lg font-bold"
                style={{ background: colors.oxoRed }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-400 mb-8">
            Tag us @cwmbrancelticfc on Instagram and Twitter
          </p>

          <Link
            href="/fixtures"
            className="inline-block bg-celtic-yellow text-celtic-dark font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            View Fixtures & Get Your OXO
          </Link>
        </div>
      </section>
    </div>
  );
}
