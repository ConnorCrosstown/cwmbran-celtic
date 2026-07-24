import { describe, it, expect } from 'vitest';
import { uploadImage } from '../blob';

describe('uploadImage', () => {
  it('delegates to the put fn and returns the public url', async () => {
    const calls: string[] = [];
    const fakePut = async (path: string) => {
      calls.push(path);
      return { url: `https://blob.example/${path}` };
    };
    const url = await uploadImage('players/7.png', Buffer.from('x'), fakePut);
    expect(url).toBe('https://blob.example/players/7.png');
    expect(calls).toEqual(['players/7.png']);
  });
});
