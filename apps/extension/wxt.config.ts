import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "SearchParty",
    description: "Foundation extension for SearchParty job application workflows.",
    permissions: ["sidePanel", "storage"],
    host_permissions: ["http://localhost:3001/*", "*"],
    side_panel: {
      default_path: "sidepanel.html",
    },
  },
  modules: ["@wxt-dev/module-react"],
});
