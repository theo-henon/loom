import type { VariableBlockData } from '../../types/blocks';

type VariableBlockProps = {
  block: VariableBlockData;
  onChange: (block: VariableBlockData) => void;
};

export function VariableBlock({ block, onChange }: VariableBlockProps) {
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-gray-700">Variable</p>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Nom</span>
        <input
          className="rounded border border-gray-300 px-2 py-1"
          value={block.name}
          onChange={(event) => onChange({ ...block, name: event.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Valeur initiale</span>
        <input
          type="number"
          className="rounded border border-gray-300 px-2 py-1"
          value={block.value}
          onChange={(event) =>
            onChange({ ...block, value: Number(event.target.value) })
          }
        />
      </label>
    </div>
  );
}
