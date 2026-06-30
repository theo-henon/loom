import type { MutexBlockData } from '../../types/blocks';
import { BlockFieldRow, blockInputClassName } from './BlockField';

type MutexBlockProps = {
  block: MutexBlockData;
  onChange: (block: MutexBlockData) => void;
};

export function MutexBlock({ block, onChange }: MutexBlockProps) {
  return (
    <BlockFieldRow label="Verrou">
      <input
        className={blockInputClassName}
        value={block.name}
        onChange={(event) => onChange({ ...block, name: event.target.value })}
      />
    </BlockFieldRow>
  );
}
