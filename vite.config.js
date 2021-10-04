import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import PluginYamlX from 'rollup-plugin-yamlx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), PluginYamlX.default()]
})
