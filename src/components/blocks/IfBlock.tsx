import { IF_ELSE_BRANCH_HELP, type IfBlockData } from '../../types/blocks';
import { BlockList, type NestedBlockListProps } from './BlockList';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

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
    <div className="space-y-1.5 text-xs">
      <div>
        <p className="mb-1 font-medium text-gray-500">Condition</p>
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

      <div>
        <p className="mb-1 font-medium text-gray-500">Alors</p>
        <BlockList
          laneId={laneId}
          blocks={block.children}
          parentBlockId={block.id}
          parentBranch="then"
          {...nestedListProps}
        />
      </div>

      {block.hasElse ? (
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <Tooltip content={IF_ELSE_BRANCH_HELP}>
              <span
                tabIndex={0}
                className="cursor-help rounded font-medium text-gray-500 outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Sinon
              </span>
            </Tooltip>
            <Button
              type="button"
              variant="secondary"
              className="px-2 py-0.5 text-xs"
              onClick={disableElse}
            >
              Retirer le sinon
            </Button>
          </div>
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
          className="w-full px-2 py-0.5 text-xs"
          onClick={enableElse}
        >
          Ajouter un sinon
        </Button>
      )}
    </div>
  );
}
