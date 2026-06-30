import type {
  Comparator,
  ConditionPredicateBlockData,
} from '../../types/blocks';
import { BlockTypeLabel } from './BlockTypeLabel';

type PredicateBlockProps = {
  block: ConditionPredicateBlockData;
  onChange: (block: ConditionPredicateBlockData) => void;
};

const COMPARATORS: Comparator[] = ['==', '!=', '<', '>', '<=', '>='];

export function PredicateBlock({ block, onChange }: PredicateBlockProps) {
  return (
    <div className="space-y-2 text-sm">
      <BlockTypeLabel type="condition" />
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Variable</span>
        <input
          className="rounded border border-gray-300 px-2 py-1"
          value={block.variable}
          onChange={(event) =>
            onChange({ ...block, variable: event.target.value })
          }
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Comparateur</span>
        <select
          className="rounded border border-gray-300 px-2 py-1"
          value={block.comparator}
          onChange={(event) =>
            onChange({
              ...block,
              comparator: event.target.value as Comparator,
            })
          }
        >
          {COMPARATORS.map((comparator) => (
            <option key={comparator} value={comparator}>
              {comparator}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Valeur de comparaison</span>
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
