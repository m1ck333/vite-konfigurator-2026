// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend) // Load translations from a server
  .use(LanguageDetector) // Detect language from browser
  .use(initReactI18next) // Bind react-i18next to the instance
  .init({
    preload: ["en", "sr"],
    fallbackLng: "en", // Fallback language
    supportedLngs: ["en", "sr"], // Explicitly declare supported languages
    backend: {
      // cache-bust the translation JSON so the browser never serves a stale copy
      // (new keys were showing as raw keys until a hard refresh otherwise)
      queryStringParams: { v: `${Date.now()}` },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
