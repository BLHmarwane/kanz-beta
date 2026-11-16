import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const path = (relative) => fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  root: path('./web'),
  base: '/kanz-beta/',
  oxc: { jsx: { runtime: 'automatic' } },
  build: {
    outDir: path('./docs'),
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        home: path('./web/index.html'),
        installation: path('./web/installation/index.html'),
        feedback: path('./web/avis/index.html'),
      },
    },
  },
})
