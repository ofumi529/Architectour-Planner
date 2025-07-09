import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'Architectour-Planner';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  server: {
    port: 5173,
  },
});
