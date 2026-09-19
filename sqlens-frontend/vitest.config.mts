import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      reportsDirectory: "coverage",
      // Coverage is scoped to runtime business logic and the interactive
      // playground/BFF leaves. App route files and static presentational
      // pages are framework glue covered by route-level verification later.
      include: [
        "lib/schemas/**/*.ts",
        "lib/playground/query-processor.ts",
        "lib/api/contracts/**/*.ts",
        "lib/api/query-keys.ts",
        "lib/api/services/query-history-client.ts",
        "lib/api/services/query-history-service.ts",
        "lib/api/hooks/use-query-history-query.ts",
        "lib/api/hooks/use-query-history-mutations.ts",
        "lib/api/server/errors.ts",
        "lib/stores/playground-ui-store.ts",
        "components/playground/sql-editor.tsx",
        "components/playground/query-history-client.tsx",
        "components/playground/query-history-skeleton.tsx",
        "components/playground/query-visualization.tsx",
        "components/playground/query-step-card.tsx",
        "components/playground/step-navigator.tsx",
        "components/playground/join-visualizer.tsx",
      ],
      exclude: ["**/*.d.ts", "**/*.config.*", "tests/**"],
    },
  },
});
