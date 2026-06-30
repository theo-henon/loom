import type { VariableBlockData } from '../../types/blocks';
import { BlockFieldRow, blockInputClassName } from './BlockField';

type VariableBlockProps = {
  block: VariableBlockData;
  onChange: (block: VariableBlockData) => void;
};

export function VariableBlock({ block, onChange }: VariableBlockProps) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
      <BlockFieldRow label="Nom">
        <input
          className={blockInputClassName}
          value={block.name}
          onChange={(event) => onChange({ ...block, name: event.target.value })}
        />
      </BlockFieldRow>
      <BlockFieldRow label="Valeur">
        <input
          type="number"
          className={blockInputClassName}
          value={block.value}
          onChange={(event) =>
            onChange({ ...block, value: Number(event.target.value) })
          }
        />
      </BlockFieldRow>
    </div>
  );
}
