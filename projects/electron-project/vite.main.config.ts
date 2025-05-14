import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    terserOptions: {
      compress: {
        drop_console: false, // 确保不移除 console 调用
      },
    },
  },
});
