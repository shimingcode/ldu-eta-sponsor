import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  base: '/ldu-eta-sponsor/',
  test: {
    environment: 'jsdom',
    // Vitest serves its runner at /; model the production asset prefix explicitly.
    env: { BASE_URL: '/ldu-eta-sponsor/' },
    include: ['tests/unit/**/*.test.ts?(x)'],
    setupFiles: ['tests/setup.ts'],
  },
})
