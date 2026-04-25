import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  //GitHub Pages는 저장소 이름과 동일한 경로 필요
  base: '/gem_gagaebu/',

  server: {
    port: 3000,           // 원하는 포트 번호
    strictPort: true,     // 선택: 포트가 이미 사용 중이면 에러 발생
    open: true,           // 서버 실행 시 브라우저 자동 열기 (선택 사항)
  },
  preview: {
    port: 4000,
    strictPort: true,     // 선택: 포트가 이미 사용 중이면 에러 발생
    open: true,           // 서버 실행 시 브라우저 자동 열기 (선택 사항)
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src")
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components")
      },
    ],
  },

  build: {
    chunkSizeWarningLimit: 1000
  }
})
