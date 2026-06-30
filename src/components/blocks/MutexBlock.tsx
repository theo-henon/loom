import type { MutexBlockData } from '../../types/blocks';
import { BlockTypeLabel } from './BlockTypeLabel';

type MutexBlockProps = {
  block: MutexBlockData;
  onChange: (block: MutexBlockData) => void;
  ownerLabel?: string | null;
};

export function MutexBlock({ block, onChange, ownerLabel }: MutexBlockProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <BlockTypeLabel type="mutex" />
        {ownerLabel ? (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
            {ownerLabel}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Libre</span>
        )}
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Nom du verrou</span>
        <input
          className="rounded border border-gray-300 px-2 py-1"
          value={block.name}
          onChange={(event) => onChange({ ...block, name: event.target.value })}
        />
      </label>
      <p className="text-xs text-gray-500">
        Les blocs en dessous ne s&apos;exécutent que par un thread à la fois.
      </p>
    </div>
  );
}
