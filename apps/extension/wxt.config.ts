import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "SearchParty",
    description: "Foundation extension for SearchParty job application workflows.",
    permissions: ["sidePanel", "storage", "tabs"],
    host_permissions: [
      "http://localhost:3001/*",
      "http://*/*",
      "https://*/*",
    ],
    side_panel: {
      default_path: "sidepanel.html",
    },
  },
  modules: ["@wxt-dev/module-react"],
});
