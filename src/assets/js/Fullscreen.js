import { useState, useEffect } from 'react';

/**
 * 전체화면 상태 감지 커스텀 훅
 */
export const useFullscreenStatus = () => {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return isFullscreen;
};

/**
 * 전체화면 토글
 */
export const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      /* iOS 등 미지원 환경 대비 */
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        /* iOS 등 미지원 환경 대비 */
      });
    }
  }
};
