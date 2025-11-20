import { defineConfig } from 'vite';
import { builtinModules } from 'module';

export default defineConfig({
  build: {
    target: 'node18',
    outDir: 'dist',
    lib: {
      entry: 'src/run.ts',
      formats: ['es'],
      fileName: 'server',
    },
    rollupOptions: {
      external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
    },
    minify: false,
    sourcemap: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
