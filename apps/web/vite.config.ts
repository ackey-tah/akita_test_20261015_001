import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * classicScriptForFileProtocol は、ビルドした index.html を file:// で直接開いても動くようにします。
 * ブラウザは file:// から type="module" のスクリプトと crossorigin 付きの読み込みを CORS で拒否するため、
 * 出力を即時実行関数（iife）の通常のスクリプトにし、HTML から module と crossorigin の指定を外します。
 * 開発サーバ（vite dev）は ES module のまま動かすので、ビルドのときだけ効かせます。
 */
function classicScriptForFileProtocol(): Plugin {
  return {
    name: "classic-script-for-file-protocol",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        const classicHtml = html
          .replace(/(<script\b[^>]*?) type="module"/gu, "$1 defer")
          .replace(/ crossorigin(="[^"]*")?/gu, "");
        // 外し損ねると file:// で画面が出ないままビルドが通ってしまうため、ここで止める
        if (/type="module"|crossorigin/u.test(classicHtml)) {
          throw new Error('index.html から type="module" と crossorigin を外せませんでした');
        }
        return classicHtml;
      },
    },
  };
}

// 相対パスで出力し、ビルドした静的ファイルをどの置き場からでも、サーバ無しでも開けるようにする。
export default defineConfig({
  base: "./",
  plugins: [react(), classicScriptForFileProtocol()],
  build: {
    modulePreload: false,
    rollupOptions: {
      output: { format: "iife" },
    },
  },
});
