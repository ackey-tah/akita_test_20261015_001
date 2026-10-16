import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const fullCoverage = { statements: 100, branches: 100, functions: 100, lines: 100 };

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["packages/*/src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "web",
          environment: "jsdom",
          include: ["apps/*/src/**/*.test.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "jsdom",
          include: ["tests/integration/**/*.integration.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**/*.{ts,tsx}", "apps/*/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.stories.tsx",
        "**/fixtures/**",
        // 振る舞いを持たないファイル（rules/testing の「カバレッジ」）: re-export だけの entrypoint と、
        // adapter を注入して組み立てるだけの composition root・エントリ。いずれも UI 結合テストが経路に含める
        "packages/*/src/index.ts",
        "packages/*/src/adapters/index.ts",
        "apps/web/src/composition/**",
        "apps/web/src/main.tsx",
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
        "packages/*/src/domain/**": fullCoverage,
        "packages/*/src/application/**": fullCoverage,
      },
    },
  },
});
