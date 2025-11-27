// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321/',
  base: '/',
   trailingSlash: "always",
   vite: {
    plugins: [tailwindcss()],
     preview: {
       allowedHosts: ['*']
     },
   },
   server: {
     host: true,
     port: 4321,
     allowedHosts: ['localhost']
   },
});