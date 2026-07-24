import type { Programme } from '@/types/programme';

type MutableProgrammeFields = Omit<Programme, 'id' | 'slug' | 'updatedAt'>;

const str = (v: unknown, base: string): string => (v === undefined ? base : String(v));

/**
 * Coerces every trust-sensitive Programme field from a raw request body,
 * falling back to `base` when a field is omitted. Single source of truth for
 * POST /api/programme (base = defaults) and PUT /api/programme/[id]
 * (base = existing record), so an omitted field never corrupts the stored
 * record and a malformed field can never violate the Programme type.
 */
export function normalizeProgrammeFields(
  body: Record<string, unknown>,
  base: MutableProgrammeFields
): MutableProgrammeFields {
  return {
    status: body.status === undefined ? base.status : body.status === 'published' ? 'published' : 'draft',
    opponent: str(body.opponent, base.opponent),
    date: str(body.date, base.date),
    kickoff: str(body.kickoff, base.kickoff),
    competition: str(body.competition, base.competition),
    matchdayNumber: str(body.matchdayNumber, base.matchdayNumber),
    venue: body.venue === undefined ? base.venue : body.venue === 'away' ? 'away' : 'home',
    team:
      body.team === undefined
        ? base.team
        : body.team === 'womens' || body.team === 'development'
          ? body.team
          : 'mens',
    startingXI: body.startingXI === undefined ? base.startingXI : Array.isArray(body.startingXI) ? body.startingXI : [],
    substitutes:
      body.substitutes === undefined ? base.substitutes : Array.isArray(body.substitutes) ? body.substitutes : [],
    captain: body.captain === undefined ? base.captain : typeof body.captain === 'number' ? body.captain : null,
    referee: str(body.referee, base.referee),
    assistantRef1: str(body.assistantRef1, base.assistantRef1),
    assistantRef2: str(body.assistantRef2, base.assistantRef2),
    fourthOfficial: str(body.fourthOfficial, base.fourthOfficial),
    matchSponsor: str(body.matchSponsor, base.matchSponsor),
    mascotSponsor: str(body.mascotSponsor, base.mascotSponsor),
    matchballSponsor: str(body.matchballSponsor, base.matchballSponsor),
    programmePrice: str(body.programmePrice, base.programmePrice),
    managersNotes: str(body.managersNotes, base.managersNotes),
    teamNews: str(body.teamNews, base.teamNews),
    specialNotes: str(body.specialNotes, base.specialNotes),
    playerToWatch:
      body.playerToWatch === undefined ? base.playerToWatch : typeof body.playerToWatch === 'number' ? body.playerToWatch : null,
    coverImage: str(body.coverImage, base.coverImage),
    actionImage: str(body.actionImage, base.actionImage),
    createdAt: str(body.createdAt, base.createdAt),
  };
}
