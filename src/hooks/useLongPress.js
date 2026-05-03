import { useRef, useCallback } from 'react';

export default function useLongPress(onClick, onLongPress, delay = 600) {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const startPress = useCallback(
    (e) => {
      isLongPress.current = false;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress(e);
      }, delay);
    },
    [onLongPress, delay],
  );

  const endPress = useCallback(
    (e) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (!isLongPress.current) {
        onClick(e);
      }
    },
    [onClick],
  );

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    onMouseDown: startPress,
    onMouseUp: endPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: endPress,
    onContextMenu: (e) => e.preventDefault(),
  };
}
