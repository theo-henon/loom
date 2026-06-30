import type {
  ArithmeticOperator,
  OperationBlockData,
} from '../../types/blocks';

type OperationBlockProps = {
  block: OperationBlockData;
  onChange: (block: OperationBlockData) => void;
};

const OPERATORS: ArithmeticOperator[] = ['+', '-', '*', '/'];

export function OperationBlock({ block, onChange }: OperationBlockProps) {
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-gray-700">Opération</p>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Variable cible</span>
        <input
          className="rounded border border-gray-300 px-2 py-1"
          value={block.targetVariable}
          onChange={(event) =>
            onChange({ ...block, targetVariable: event.target.value })
          }
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Opérateur</span>
        <select
          className="rounded border border-gray-300 px-2 py-1"
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
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Opérande</span>
        <input
          type="number"
          className="rounded border border-gray-300 px-2 py-1"
          value={block.operand}
          onChange={(event) =>
            onChange({ ...block, operand: Number(event.target.value) })
          }
        />
      </label>
    </div>
  );
}
