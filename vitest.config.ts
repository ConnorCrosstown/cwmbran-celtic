import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 'server-only' throws outside a React Server context; use its no-op
      // variant in tests so server modules (comet.ts) can be imported.
      'server-only': path.resolve(__dirname, 'node_modules/server-only/empty.js'),
    },
  },
});
