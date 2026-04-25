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
    requestFullscreen();
  } else {
    exitFullscreen()
  }
};

export const requestFullscreen = () => {
  document.documentElement.requestFullscreen().catch(() => {
    console.warn('전체화면 전환 실패: 브라우저 보안 정책상 사용자 제스처가 필요합니다.');
  });
}

export const exitFullscreen = () => {
  document.exitFullscreen().catch(() => {
    console.warn('전체화면 해제 실패: 브라우저 보안 정책상 사용자 제스처가 필요합니다.');
  });
}