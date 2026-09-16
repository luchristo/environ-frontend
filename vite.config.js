import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

export default defineConfig({
  build: { assetsInlineLimit: 0 },
  plugins: [
    react(),
    {
      name: 'inline-small-global-styles',
      transformIndexHtml() {
        return [{
          tag: 'style',
          children: readFileSync(new URL('./src/index.css', import.meta.url), 'utf8'),
          injectTo: 'head',
        }]
      },
    },
  ],
})