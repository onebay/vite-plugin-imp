import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import vitePluginImp from 'vite-plugin-imp'
import vitePluginImp from '../../dist/index.cjs'
import { visualizer } from 'rollup-plugin-visualizer'

const { ANALYZE } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImp(),
    ANALYZE === '1' ? visualizer({ open: true, filename: 'visualizer/stat.html' }) : null,
  ].filter(Boolean)
})
