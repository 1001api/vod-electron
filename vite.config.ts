import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from "@tailwindcss/vite";
import { vite as vidstack } from 'vidstack/plugins';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vidstack(),
    tailwindcss(),
    svelte()
  ],
})
