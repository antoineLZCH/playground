import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
  devtools: { enabled: true },
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(
            dirname(fileURLToPath(import.meta.url)),
            "./src/locales/*.json"
          ),
        ],
        runtimeOnly: false,
        strictMessage: false,
      }),
    ],
  }
});
