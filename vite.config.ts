import { defineConfig, type PluginOption } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'
import { renameSync, existsSync, rmSync, mkdirSync } from 'fs'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

function pagesRewrite(): PluginOption {
  return {
    name: 'pages-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next()
        // Skip internal Vite paths
        if (
          req.url.startsWith('/src/') ||
          req.url.startsWith('/node_modules/') ||
          req.url.startsWith('/@') ||
          req.url.startsWith('/pages/')
        ) {
          return next()
        }
        // Rewrite / to /pages/index.html
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/pages/index.html'
        } else {
          // Rewrite /admin/dashboard.html -> /pages/admin/dashboard.html
          req.url = '/pages' + req.url
        }
        next()
      })
    },
  }
}

// Move dist/pages/* to dist/* after build
function flattenPagesOutput(): PluginOption {
  return {
    name: 'flatten-pages-output',
    closeBundle() {
      const pagesDir = resolve(__dirname, 'dist/pages')
      if (existsSync(pagesDir)) {
        for (const entry of globSync('dist/pages/**/*', { nodir: true })) {
          const dest = entry.replace('dist/pages/', 'dist/')
          const destParent = dirname(resolve(__dirname, dest))
          if (!existsSync(destParent)) {
            mkdirSync(destParent, { recursive: true })
          }
          renameSync(resolve(__dirname, entry), resolve(__dirname, dest))
        }
        rmSync(pagesDir, { recursive: true })
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [pagesRewrite(), tailwindcss(), flattenPagesOutput()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        globSync('pages/**/*.html').map((file) => [
          file.replace('pages/', '').replace('.html', ''),
          resolve(__dirname, file),
        ])
      ),
    },
  },
  server: {
    open: '/',
  },
})
