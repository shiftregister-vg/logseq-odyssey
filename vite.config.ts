import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import logseqDevPlugin from './vite-plugin-logseq-local'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), logseqDevPlugin()],
  build: {
    target: "esnext",
    minify: "esbuild",
  },
})