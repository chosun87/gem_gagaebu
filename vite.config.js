import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from './package.json';

// ESM 환경에서도 __dirname을 사용할 수 있도록 설정 (Node.js 20+ 권장)
// __dirname은 현재 파일의 디렉토리 경로를 나타냅니다.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },

  //GitHub Pages는 저장소 이름과 동일한 경로 필요
  base: '/gem_gagaebu/',

  server: {
    port: 3000, // 원하는 포트 번호
    strictPort: true, // 선택: 포트가 이미 사용 중이면 에러 발생
    open: true, // 서버 실행 시 브라우저 자동 열기 (선택 사항)
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  preview: {
    port: 4000,
    strictPort: true, // 선택: 포트가 이미 사용 중이면 에러 발생
    open: true, // 서버 실행 시 브라우저 자동 열기 (선택 사항)
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src/primereact'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/primereact/components'),
      },
    ],
  },

  build: {
    chunkSizeWarningLimit: 1000,
  },
});
