import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (empty prefix) so we can keep the existing
  // REACT_APP_* names without rewriting every `process.env.REACT_APP_*` usage.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: Number(env.PORT) || 3822,
      open: false,
    },
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          // Split big third-party libs into cacheable vendor chunks
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
            "i18n-vendor": [
              "i18next",
              "react-i18next",
              "i18next-http-backend",
              "i18next-browser-languagedetector",
            ],
            "fontawesome-vendor": [
              "@fortawesome/fontawesome-svg-core",
              "@fortawesome/free-solid-svg-icons",
              "@fortawesome/react-fontawesome",
            ],
            "util-vendor": [
              "react-rnd",
              "react-datepicker",
              "react-to-print",
              "react-toastify",
              "swr",
              "date-fns",
            ],
          },
        },
      },
    },
    // Shim CRA-style env access so the ported logic compiles unchanged.
    define: {
      "process.env.REACT_APP_API_URL": JSON.stringify(
        env.REACT_APP_API_URL ?? ""
      ),
      "process.env.REACT_APP_NODE_ENV": JSON.stringify(
        env.REACT_APP_NODE_ENV ?? mode
      ),
    },
  };
});
