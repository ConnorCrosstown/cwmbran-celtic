'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Fixtures', href: '/fixtures' },
  {
    label: 'Teams',
    href: '/teams',
    children: [
      { label: "Men's First Team", href: '/teams/mens' },
      { label: "Women's Team", href: '/teams/ladies' },
      { label: "Walking Football", href: '/teams/walking' },
    ],
  },
  {
    label: 'Match Day',
    href: '/tickets',
    children: [
      { label: 'Buy Tickets', href: '/tickets' },
      { label: 'Visit Us', href: '/visit' },
      { label: 'Match Programme', href: '/programme' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    label: 'Club',
    href: '/club',
    children: [
      { label: 'About Us', href: '/club' },
      { label: 'Club History', href: '/club/history' },
      { label: 'Club Officials', href: '/club/officials' },
      { label: 'Season Archives', href: '/club/archives' },
      { label: 'Club Documents', href: '/club/documents' },
      { label: 'Community', href: '/community' },
      { label: 'Sponsors', href: '/sponsors' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Supporters',
    href: '/celtic-bond',
    children: [
      { label: 'Celtic Bond', href: '/celtic-bond' },
      { label: 'Bond Results', href: '/celtic-bond/results' },
      { label: 'Celtic Card', href: '/celtic-card' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
];

interface NavigationProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

function DropdownMenu({ item, mobile, onItemClick }: { item: NavItem; mobile?: boolean; onItemClick?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const isActive = pathname === item.href ||
    (item.href !== '/' && pathname?.startsWith(item.href)) ||
    item.children?.some(child => pathname === child.href || pathname?.startsWith(child.href));

  const handleMouseEnter = () => {
    if (!mobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!mobile) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (mobile) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-2 px-4 rounded-lg ${
            isActive ? 'bg-celtic-blue-dark text-celtic-yellow' : 'text-white hover:bg-celtic-blue-dark'
          }`}
        >
          {item.label}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && item.children && (
          <div className="pl-4 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block py-2 px-4 rounded-lg text-sm ${
                  pathname === child.href
                    ? 'bg-celtic-blue-dark text-celtic-yellow'
                    : 'text-white/80 hover:bg-celtic-blue-dark hover:text-white'
                }`}
                onClick={onItemClick}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors duration-200 ${
          isActive
            ? 'bg-celtic-blue-dark text-celtic-yellow'
            : 'text-white hover:bg-celtic-blue-dark hover:text-celtic-yellow'
        }`}
      >
        {item.label}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {isOpen && item.children && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-2 text-sm transition-colors ${
                pathname === child.href
                  ? 'bg-celtic-blue/10 text-celtic-blue dark:text-celtic-yellow'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
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
        if (item.children) {
          return (
            <DropdownMenu
              key={item.href}
              item={item}
              mobile={mobile}
              onItemClick={onItemClick}
            />
          );
        }

        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href));

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
