import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "6m7esb", // <-- Hier komt hij te staan!
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});