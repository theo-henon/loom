import type { Comparator, ConditionBlockData } from '../../types/blocks';
import { BlockTypeLabel } from './BlockTypeLabel';
import { BlockList, type NestedBlockListProps } from './BlockList';
import { Button } from '../ui/Button';

type ConditionBlockProps = {
  block: ConditionBlockData;
  onChange: (block: ConditionBlockData) => void;
  laneId: string;
  nestedListProps: NestedBlockListProps;
};

const COMPARATORS: Comparator[] = ['==', '!=', '<', '>', '<=', '>='];

export function ConditionBlock({
  block,
  onChange,
  laneId,
  nestedListProps,
}: ConditionBlockProps) {
  const enableElse = () => {
    onChange({ ...block, hasElse: true });
  };

  const disableElse = () => {
    onChange({ ...block, hasElse: false, elseChildren: [] });
  };

  return (
    <div className="space-y-2 text-sm">
      <BlockTypeLabel type="condition" />
      <p className="text-xs text-gray-400">
        Les blocs « Alors » s&apos;exécutent si la condition est vraie.
      </p>
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

      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-gray-500">Alors</p>
        <BlockList
          laneId={laneId}
          blocks={block.children}
          parentBlockId={block.id}
          parentBranch="then"
          {...nestedListProps}
        />
      </div>

      {block.hasElse ? (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-gray-500">Sinon</p>
            <Button
              type="button"
              variant="secondary"
              className="text-xs"
              onClick={disableElse}
            >
              Retirer le sinon
            </Button>
          </div>
          <p className="mb-2 text-xs text-gray-400">
            Exécuté quand la condition est fausse.
          </p>
          <BlockList
            laneId={laneId}
            blocks={block.elseChildren}
            parentBlockId={block.id}
            parentBranch="else"
            {...nestedListProps}
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className="mt-2 w-full text-xs"
          onClick={enableElse}
        >
          Ajouter un sinon
        </Button>
      )}
    </div>
  );
}
