import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // scripts/uld と .claude は uld-kit が配布しハッシュで管理するため、lint の対象にしない
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/coverage/",
      "**/storybook-static/",
      "scripts/uld/",
      ".claude/",
      ".designs/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js", ".dependency-cruiser.cjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // 内側の層はブラウザ・Node の実行環境と乱数に直接触れない。外部依存は port で受ける（docs/architecture）。
    // tsconfig は 1 つで DOM と Node の型を全体に与えているため、型ではなく lint で止める
    files: ["packages/*/src/{domain,application,errors}/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        "window",
        "document",
        "navigator",
        "localStorage",
        "sessionStorage",
        "process",
        "crypto",
        "fetch",
      ],
      "no-restricted-properties": [
        "error",
        { object: "Math", property: "random", message: "乱数は adapter から port で受け取る" },
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.cjs"],
    languageOptions: { sourceType: "commonjs" },
  },
);
