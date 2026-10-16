// import 境界の機械チェック。境界表の正は docs/architecture/README.md の「層と依存」で、
// 表を変えるときはこの設定を同じ変更で更新する（rules/architecture/project.md）。
// 層の import 可否は「許可したもの以外を拒否する」形で書く。拒否するものを列挙すると、
// 想定していない依存（UI framework・外側の app など）が素通りするため。
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "循環依存を禁止する",
      from: {},
      to: { circular: true },
    },
    {
      name: "production-not-to-tests",
      severity: "error",
      comment: "production コードから tests/ を import しない",
      from: { path: "^(packages|apps)/", pathNot: "[.](test|stories)[.]tsx?$" },
      to: { path: "^tests/" },
    },
    {
      name: "packages-not-to-apps",
      severity: "error",
      comment: "依存は外側から内側へ向ける。packages は apps と tests を import しない",
      from: { path: "^packages/" },
      to: { path: "^(apps|tests)/" },
    },
    {
      name: "shared-kernel-self-contained",
      severity: "error",
      comment: "shared-kernel は業務 module に依存しない（自分自身と Node の組み込みだけ）",
      from: { path: "^packages/shared-kernel/", pathNot: "[.]test[.]ts$" },
      to: { pathNot: "^packages/shared-kernel/", dependencyTypesNot: ["core"] },
    },
    {
      name: "errors-only-errors-and-shared-kernel",
      severity: "error",
      comment: "errors は同じ module の errors と shared-kernel だけを import する",
      from: { path: "^packages/([^/]+)/src/errors/", pathNot: "[.]test[.]ts$" },
      to: {
        pathNot: ["^packages/$1/src/errors/", "^packages/shared-kernel/src/"],
        dependencyTypesNot: ["core"],
      },
    },
    {
      name: "domain-only-domain-errors-and-shared-kernel",
      severity: "error",
      comment: "domain は同じ module の domain・errors と shared-kernel だけを import する",
      from: { path: "^packages/([^/]+)/src/domain/", pathNot: "[.]test[.]ts$" },
      to: {
        pathNot: ["^packages/$1/src/(domain|errors)/", "^packages/shared-kernel/src/"],
        dependencyTypesNot: ["core"],
      },
    },
    {
      name: "application-only-inner-layers",
      severity: "error",
      comment:
        "application は同じ module の application・domain・errors と shared-kernel だけを import する（外部依存は port で受ける）",
      from: { path: "^packages/([^/]+)/src/application/", pathNot: "[.]test[.]ts$" },
      to: {
        pathNot: ["^packages/$1/src/(application|domain|errors)/", "^packages/shared-kernel/src/"],
        dependencyTypesNot: ["core"],
      },
    },
    {
      name: "adapters-only-inner-layers",
      severity: "error",
      comment:
        "adapters は同じ module の adapters・application・domain・errors と shared-kernel だけを import する",
      from: { path: "^packages/([^/]+)/src/adapters/", pathNot: "[.]test[.]ts$" },
      to: {
        pathNot: [
          "^packages/$1/src/(adapters|application|domain|errors)/",
          "^packages/shared-kernel/src/",
        ],
        dependencyTypesNot: ["core"],
      },
    },
    {
      name: "public-entry-not-to-domain-or-adapters",
      severity: "error",
      comment: "公開 entrypoint は domain と adapter を export しない",
      from: { path: "^packages/([^/]+)/src/index[.]ts$" },
      to: { path: "^packages/$1/src/(domain|adapters)/" },
    },
    {
      name: "no-internal-path-of-other-package",
      severity: "error",
      comment:
        "他 package は公開された入口（src/index.ts・src/adapters/index.ts）だけを import する",
      from: { path: "^(packages|apps)/([^/]+)/" },
      to: {
        path: "^packages/([^/]+)/src/",
        pathNot: [
          "^packages/$2/",
          "^packages/[^/]+/src/index[.]ts$",
          "^packages/[^/]+/src/adapters/index[.]ts$",
        ],
      },
    },
    {
      name: "tests-only-public-entries",
      severity: "error",
      comment:
        "結合テストは apps/web の composition root と画面を使い、packages の内部 path を import しない",
      from: { path: "^tests/" },
      to: {
        path: "^packages/([^/]+)/src/",
        pathNot: ["^packages/[^/]+/src/index[.]ts$"],
      },
    },
    {
      name: "adapter-entry-only-from-composition-root",
      severity: "error",
      comment:
        "adapter 用の entrypoint を import してよいのは composition root（と同じ package の中）だけ",
      from: { path: "^(packages|apps|tests)/([^/]+)/", pathNot: "^apps/web/src/composition/" },
      to: { path: "^packages/([^/]+)/src/adapters/", pathNot: "^packages/$2/" },
    },
    {
      name: "presentation-not-to-composition-root",
      severity: "error",
      comment:
        "画面は composition root を import しない。application service はエントリから props で受け取る",
      from: { path: "^apps/web/src/(screens|components)/" },
      to: { path: "^apps/web/src/composition/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".ts", ".tsx", ".js", ".cjs", ".mjs"],
    },
  },
};
