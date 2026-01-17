'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Fixtures', href: '/fixtures' },
  { label: 'Teams', href: '/teams' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Community', href: '/community' },
  { label: 'Visit Us', href: '/visit' },
  { label: 'The Club', href: '/club' },
  { label: 'Celtic Bond', href: '/celtic-bond' },
  { label: 'Shop', href: 'https://rhino.direct/pages/cwmbran-celtic-club-shop', external: true },
  { label: 'Contact', href: '/contact' },
];

interface NavigationProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

export default function Navigation({ mobile = false, onItemClick }: NavigationProps) {
  const pathname = usePathname();

  const baseClasses = mobile
    ? 'block py-2 px-4 rounded-lg'
    : 'px-3 py-2 rounded-lg text-sm font-medium';

  const activeClasses = 'bg-celtic-blue-dark text-celtic-yellow';
  const inactiveClasses = 'text-white hover:bg-celtic-blue-dark hover:text-celtic-yellow';

  return (
    <nav className={mobile ? 'space-y-1' : 'flex items-center space-x-1'}>
      {navItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href));

        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClasses} ${inactiveClasses} inline-flex items-center`}
              onClick={onItemClick}
            >
              {item.label}
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} transition-colors duration-200`}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
