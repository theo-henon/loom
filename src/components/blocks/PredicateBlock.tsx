import type {
  Comparator,
  ConditionPredicateBlockData,
} from '../../types/blocks';
import { BlockFieldRow, blockInputClassName } from './BlockField';

type PredicateBlockProps = {
  block: ConditionPredicateBlockData;
  onChange: (block: ConditionPredicateBlockData) => void;
};

const COMPARATORS: Comparator[] = ['==', '!=', '<', '>', '<=', '>='];

export function PredicateBlock({ block, onChange }: PredicateBlockProps) {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-x-2">
        <BlockFieldRow label="Variable">
          <input
            className={blockInputClassName}
            value={block.variable}
            onChange={(event) =>
              onChange({ ...block, variable: event.target.value })
            }
          />
        </BlockFieldRow>
        <BlockFieldRow label="Test">
          <select
            className={blockInputClassName}
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
        </BlockFieldRow>
      </div>
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
