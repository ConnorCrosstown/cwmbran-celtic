import type { SquadPlayer } from '@/types/programme';

/**
 * Builds a SquadPlayer from a raw request body. Callers are responsible for
 * validating `body.squadNo` is a number (400) BEFORE calling this — this
 * helper only handles field coercion, not the HTTP response.
 */
export function buildPlayer(body: Record<string, unknown> & { squadNo: number }, id: string): SquadPlayer {
  return {
    id,
    squadNo: body.squadNo,
    firstName: String(body.firstName ?? ''),
    lastName: String(body.lastName ?? ''),
    position: String(body.position ?? ''),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    penPicture: body.penPicture ? String(body.penPicture) : undefined,
  };
}
