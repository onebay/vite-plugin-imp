import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from '../../dist/index.cjs'
import { visualizer } from 'rollup-plugin-visualizer'

const { ANALYZE } = process.env;

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h } from 'vue'`
  },
  plugins: [
    vue(),
    vitePluginImp(),
    ANALYZE === '1' ? visualizer({ open: true, filename: 'visualizer/stat.html' }) : false,
  ].filter(Boolean)
})
