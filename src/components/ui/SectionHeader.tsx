import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  centered = false,
  viewAllLink,
  viewAllText = 'View All',
  className = '',
}: SectionHeaderProps) {
  if (centered) {
    return (
      <div className={`section-header-centered ${className}`}>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle mt-2">{subtitle}</p>}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div className="section-header">
        <div className="section-header-accent" />
        <div className="section-header-content">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-celtic-blue dark:text-celtic-yellow font-semibold text-sm hover:underline flex items-center gap-1 group"
        >
          {viewAllText}
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
