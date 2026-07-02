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
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
