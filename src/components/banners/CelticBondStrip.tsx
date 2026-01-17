import Link from 'next/link';

export default function CelticBondStrip() {
  return (
    <div className="bg-celtic-yellow py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="hidden sm:inline">🎟️</span>
          <span className="font-semibold text-celtic-dark">Celtic Bond</span>
          <span className="text-celtic-dark/70 hidden sm:inline">–</span>
          <span className="text-celtic-dark/70 hidden md:inline">Support the club & win monthly cash prizes</span>
          <Link
            href="/celtic-bond"
            className="bg-celtic-blue text-white py-1 px-3 rounded font-semibold text-xs hover:bg-celtic-blue-dark transition-colors ml-2"
          >
            Join for £10/month
          </Link>
        </div>
      </div>
    </div>
  );
}
