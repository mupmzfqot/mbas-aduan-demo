import { defineConfig, type PluginOption } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'
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

export default defineConfig({
  base: '/',
  plugins: [pagesRewrite(), tailwindcss()],
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
