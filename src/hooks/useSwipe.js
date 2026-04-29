import { useRef } from 'react';

/**
 * 터치 스와이프 이벤트를 처리하는 커스텀 훅
 * @param {Object} handlers - { onSwipeLeft, onSwipeRight } 
 * @param {number} minSwipeDistance - 스와이프로 인식할 최소 거리 (기본값: 50)
 * @returns {Object} 터치 이벤트 핸들러 { onTouchStart, onTouchEnd }
 */
export const useSwipe = ({ onSwipeLeft, onSwipeRight, minSwipeDistance = 50 }) => {
  const touchStart = useRef(null);

  const onTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // 왼쪽으로 스와이프 (다음으로 이동)
        if (onSwipeLeft) onSwipeLeft();
      } else {
        // 오른쪽으로 스와이프 (이전으로 이동)
        if (onSwipeRight) onSwipeRight();
      }
    }
    touchStart.current = null;
  };

  return { onTouchStart, onTouchEnd };
};
