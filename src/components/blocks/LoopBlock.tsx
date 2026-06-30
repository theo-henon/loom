import type { LoopBlockData } from '../../types/blocks';
import { BlockTypeLabel } from './BlockTypeLabel';

type LoopBlockProps = {
  block: LoopBlockData;
  onChange: (block: LoopBlockData) => void;
};

export function LoopBlock({ block, onChange }: LoopBlockProps) {
  return (
    <div className="space-y-2 text-sm">
      <BlockTypeLabel type="loop" />
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Nombre d&apos;itérations</span>
        <input
          type="number"
          min={1}
          className="rounded border border-gray-300 px-2 py-1"
          value={block.iterations}
          onChange={(event) =>
            onChange({
              ...block,
              iterations: Math.max(1, Number(event.target.value)),
            })
          }
        />
      </label>
    </div>
  );
}
