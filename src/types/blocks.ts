export type BlockType =
  'variable' | 'operation' | 'condition' | 'loop' | 'mutex';

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

export type ConditionBlockData = BlockBase & {
  type: 'condition';
  variable: string;
  comparator: Comparator;
  value: number;
  children: Block[];
  hasElse: boolean;
  elseChildren: Block[];
};

export type LoopBlockData = BlockBase & {
  type: 'loop';
  iterations: number;
  children: Block[];
};

export type MutexBlockData = BlockBase & {
  type: 'mutex';
  name: string;
};

export type Block =
  | VariableBlockData
  | OperationBlockData
  | ConditionBlockData
  | LoopBlockData
  | MutexBlockData;

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  variable: 'Variable',
  operation: 'Opération',
  condition: 'Si...Alors',
  loop: 'Boucle',
  mutex: 'Mutex',
};

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
        children: [],
        hasElse: false,
        elseChildren: [],
      };
    case 'loop':
      return { id, type, iterations: 3, children: [] };
    case 'mutex':
      return { id, type, name: 'verrou' };
  }
}
