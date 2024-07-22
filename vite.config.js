import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,  // 設定你希望使用的端口號
    proxy: {
      '/ktv-app/api': {
        target: 'http://localhost:8080',  // 你的後端 API 伺服器地址
        changeOrigin: true,
        pathRewrite: { '^/ktv-app/api': '' },  // 請求轉發到 API 路徑，移除 `/ktv-app/api`
        assetsInclude: ['**/*.jpg', '**/*.png']  // 確保處理圖片文件
      },
    },
  },
});
