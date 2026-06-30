import type {
  ArithmeticOperator,
  OperationBlockData,
} from '../../types/blocks';
import { BlockFieldRow, blockInputClassName } from './BlockField';

type OperationBlockProps = {
  block: OperationBlockData;
  onChange: (block: OperationBlockData) => void;
};

const OPERATORS: ArithmeticOperator[] = ['+', '-', '*', '/'];

export function OperationBlock({ block, onChange }: OperationBlockProps) {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-x-2">
        <BlockFieldRow label="Cible">
          <input
            className={blockInputClassName}
            value={block.targetVariable}
            onChange={(event) =>
              onChange({ ...block, targetVariable: event.target.value })
            }
          />
        </BlockFieldRow>
        <BlockFieldRow label="Op.">
          <select
            className={blockInputClassName}
            value={block.operator}
            onChange={(event) =>
              onChange({
                ...block,
                operator: event.target.value as ArithmeticOperator,
              })
            }
          >
            {OPERATORS.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>
        </BlockFieldRow>
      </div>
      <BlockFieldRow label="Opérande">
        <input
          type="number"
          className={blockInputClassName}
          value={block.operand}
          onChange={(event) =>
            onChange({ ...block, operand: Number(event.target.value) })
          }
        />
      </BlockFieldRow>
    </div>
  );
}
