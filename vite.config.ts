import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@core": fileURLToPath(new URL("./src/core", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/ui", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
});
