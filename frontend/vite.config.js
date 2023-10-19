import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import inject from "@rollup/plugin-inject"
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    strictPort: true,
    host: "0.0.0.0",
  },
  optimizeDeps: {
    include: ["@safe-global/protocol-kit", "@safe-global/api-kit"],
    esbuildOptions: {
      define: {
        global: "globalThis",
    
      },

      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true, process: true }),
        // NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          // @ts-ignore
          rollupNodePolyFill(),
      ]
  }
   
  },
  resolve: {
    alias: {
       buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6.js',
 
      global: "rollup-plugin-node-polyfills/polyfills/global.js",
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
