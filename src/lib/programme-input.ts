import type { Programme } from '@/types/programme';

type MutableProgrammeFields = Pick<Programme, 'status' | 'startingXI' | 'substitutes' | 'captain'>;

/**
 * Coerces the mutable/trust-sensitive Programme fields from a raw request
 * body, falling back to `base` when a field is omitted. Used by both
 * POST /api/programme (base = defaults) and PUT /api/programme/[id]
 * (base = the existing stored record) so the coercion rules live in one
 * place and an omitted field never silently corrupts the stored record.
 */
export function normalizeProgrammeFields(
  body: Record<string, unknown>,
  base: MutableProgrammeFields
): MutableProgrammeFields {
  return {
    status: body.status === undefined ? base.status : body.status === 'published' ? 'published' : 'draft',
    startingXI:
      body.startingXI === undefined ? base.startingXI : Array.isArray(body.startingXI) ? body.startingXI : [],
    substitutes:
      body.substitutes === undefined ? base.substitutes : Array.isArray(body.substitutes) ? body.substitutes : [],
    captain: body.captain === undefined ? base.captain : typeof body.captain === 'number' ? body.captain : null,
  };
}
