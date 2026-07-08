import Image from 'next/image';
import { resolveTeamCrest } from '@/lib/team-crest';

export default function TeamCrest({ name, size = 40 }: { name: string; size?: number }) {
  const crest = resolveTeamCrest(name);

  if (crest.kind === 'image') {
    return (
      <Image
        src={crest.src}
        alt={crest.alt}
        width={size}
        height={size}
        className="rounded-full object-contain bg-white"
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${crest.hue}, 55%, 40%)`,
        fontSize: Math.round(size * 0.38),
      }}
      role="img"
      aria-label={crest.alt}
    >
      {crest.initials}
    </div>
  );
}
