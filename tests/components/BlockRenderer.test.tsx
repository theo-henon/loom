import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlockRenderer } from '../../src/components/blocks/BlockRenderer';
import { createBlock } from '../../src/types/blocks';

describe('BlockRenderer', () => {
  it('shows a colored dot on the active block', () => {
    const block = createBlock('variable');

    render(
      <BlockRenderer
        block={block}
        laneId="lane-1"
        onChange={vi.fn()}
        onRemove={vi.fn()}
        isActive
        threadColor="#6366F1"
        threadStatus="running"
      />,
    );

    expect(screen.getByTestId('thread-dot')).toBeInTheDocument();
  });

  it('hides the dot when the block is inactive', () => {
    const block = createBlock('variable');

    render(
      <BlockRenderer
        block={block}
        laneId="lane-1"
        onChange={vi.fn()}
        onRemove={vi.fn()}
        isActive={false}
        threadColor="#6366F1"
        threadStatus="idle"
      />,
    );

    expect(screen.queryByTestId('thread-dot')).not.toBeInTheDocument();
  });
});
