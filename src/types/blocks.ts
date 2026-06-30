export type BlockType =
  'variable' | 'operation' | 'condition' | 'if' | 'loop' | 'mutex';

export type ArithmeticOperator = '+' | '-' | '*' | '/';
export type Comparator = '==' | '!=' | '<' | '>' | '<=' | '>=';

type BlockBase = {
  id: string;
};

export type VariableBlockData = BlockBase & {
  type: 'variable';
  name: string;
  value: number;
};

export type OperationBlockData = BlockBase & {
  type: 'operation';
  targetVariable: string;
  operator: ArithmeticOperator;
  operand: number;
};

export type ConditionPredicateBlockData = BlockBase & {
  type: 'condition';
  variable: string;
  comparator: Comparator;
  value: number;
};

export type IfBlockData = BlockBase & {
  type: 'if';
  condition: Block[];
  children: Block[];
  hasElse: boolean;
  elseChildren: Block[];
};

export type LoopBlockData = BlockBase & {
  type: 'loop';
  condition: Block[];
  children: Block[];
};

export type MutexBlockData = BlockBase & {
  type: 'mutex';
  name: string;
};

export type Block =
  | VariableBlockData
  | OperationBlockData
  | ConditionPredicateBlockData
  | IfBlockData
  | LoopBlockData
  | MutexBlockData;

export type BlockContainer = IfBlockData | LoopBlockData;

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  variable: 'Variable',
  operation: 'Opération',
  condition: 'Condition',
  if: 'Si...Alors',
  loop: 'Boucle',
  mutex: 'Mutex',
};

export function getContainerPredicate(
  block: BlockContainer,
): ConditionPredicateBlockData | null {
  const predicate = block.condition[0];
  return predicate?.type === 'condition' ? predicate : null;
}

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();

  switch (type) {
    case 'variable':
      return { id, type, name: 'x', value: 0 };
    case 'operation':
      return {
        id,
        type,
        targetVariable: 'x',
        operator: '+',
        operand: 1,
      };
    case 'condition':
      return {
        id,
        type,
        variable: 'x',
        comparator: '==',
        value: 0,
      };
    case 'if':
      return {
        id,
        type,
        condition: [],
        children: [],
        hasElse: false,
        elseChildren: [],
      };
    case 'loop':
      return { id, type, condition: [], children: [] };
    case 'mutex':
      return { id, type, name: 'verrou' };
  }
}
