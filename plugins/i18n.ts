import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "fr",
    messages: messages,
  });

  async function loadLocale() {
    return fetch("https://api-playground-rho.vercel.app/json")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Something went wrong");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function setLocale() {
    const loadedMessages = await loadLocale();

    if (loadedMessages === undefined) return;

    i18n.global.setLocaleMessage("fr", loadedMessages);
    i18n.global.locale.value = "fr";
  }

  setInterval(async () => await setLocale(), 20000);
  await setLocale();

  nuxtApp.vueApp.use(i18n);
});
