import { useCallback, useRef } from 'react';

type UsePointerResizeOptions = {
  onResize: (delta: number) => void;
  axis: 'x' | 'y';
};

export function usePointerResize({ onResize, axis }: UsePointerResizeOptions) {
  const startRef = useRef<{ position: number } | null>(null);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      startRef.current = {
        position: axis === 'x' ? event.clientX : event.clientY,
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!startRef.current) {
          return;
        }

        const current = axis === 'x' ? moveEvent.clientX : moveEvent.clientY;
        const delta = current - startRef.current.position;
        startRef.current.position = current;
        onResize(delta);
      };

      const handlePointerUp = () => {
        startRef.current = null;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [axis, onResize],
  );

  return handlePointerDown;
}
