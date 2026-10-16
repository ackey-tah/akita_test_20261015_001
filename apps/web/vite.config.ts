import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 相対パスで出力し、ビルドした静的ファイルをどの置き場からでも開けるようにする。
export default defineConfig({
  base: "./",
  plugins: [react()],
});
