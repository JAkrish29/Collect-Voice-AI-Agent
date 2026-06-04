import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "tests/unit/**/*.test.ts",
      "tests/integration/**/*.test.ts",
      "tests/redteam/**/*.test.ts",
      "tests/security/**/*.test.ts",
      "tests/chaos/**/*.test.ts",
      "tests/reports/**/*.test.ts"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "coverage",
      include: ["src/server/simulation/**/*.ts"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
