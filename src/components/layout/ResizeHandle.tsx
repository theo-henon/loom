type ResizeHandleProps = {
  orientation: 'vertical' | 'horizontal';
  label: string;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
};

export function ResizeHandle({
  orientation,
  label,
  onPointerDown,
}: ResizeHandleProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      onPointerDown={onPointerDown}
      className={`shrink-0 touch-none select-none bg-gray-200 transition-colors hover:bg-indigo-300 active:bg-indigo-400 ${
        isVertical ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize'
      }`}
    />
  );
}
