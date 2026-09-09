import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' uses relative asset paths so the build works whether it's
// hosted at the domain root (custom domain / user page) or in a
// /<repo-name>/ subpath (project page) on GitHub Pages — no config change
// needed either way. HashRouter (not BrowserRouter) is what makes routing
// itself work on GitHub Pages without server-side rewrites.
export default defineConfig({
  base: './',
  plugins: [react()],
})
