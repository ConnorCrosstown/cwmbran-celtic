import { describe, it, expect } from 'vitest';
import { getOppositionByName } from '@/data/opposition-data';

const ARDAL_SE = [
  'Abercarn United', 'Abergavenny Town', 'Blaenavon Blues', 'Brecon Corries',
  'Caldicot Town', 'Chepstow Town', 'Croesyceiliog', 'Cwmbran Town', 'Goytre',
  'Lliswerry', 'New Inn', 'Newport Corinthians', 'Risca United',
  'Tredegar Town', 'Undy',
];

describe('Ardal South East opposition data', () => {
  it('resolves every current opponent by its exact feed name', () => {
    for (const name of ARDAL_SE) {
      const team = getOppositionByName(name);
      expect(team, `missing: ${name}`).toBeDefined();
      expect(team!.name).toBe(name);
    }
  });
});
