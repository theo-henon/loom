import type { IfBlockData } from '../../types/blocks';
import { BlockTypeLabel } from './BlockTypeLabel';
import { BlockList, type NestedBlockListProps } from './BlockList';
import { Button } from '../ui/Button';

type IfBlockProps = {
  block: IfBlockData;
  onChange: (block: IfBlockData) => void;
  laneId: string;
  nestedListProps: NestedBlockListProps;
};

export function IfBlock({
  block,
  onChange,
  laneId,
  nestedListProps,
}: IfBlockProps) {
  const enableElse = () => {
    onChange({ ...block, hasElse: true });
  };

  const disableElse = () => {
    onChange({ ...block, hasElse: false, elseChildren: [] });
  };

  return (
    <div className="space-y-2 text-sm">
      <BlockTypeLabel type="if" />
      <p className="text-xs text-gray-400">
        Insérez un bloc Condition, puis les blocs à exécuter dans « Alors ».
      </p>

      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-gray-500">Condition</p>
        <BlockList
          laneId={laneId}
          blocks={block.condition}
          parentBlockId={block.id}
          parentBranch="condition"
          allowedBlockTypes={['condition']}
          emptyLabel="Glissez un bloc Condition ici."
          appendLabel=""
          {...nestedListProps}
        />
      </div>

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
