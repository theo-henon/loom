import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlockPalette } from '../../src/components/palette/BlockPalette';
import { ProgramProvider } from '../../src/hooks/ProgramProvider';

describe('BlockPalette', () => {
  it('shows an icon for each block type', () => {
    render(
      <ProgramProvider>
        <BlockPalette />
      </ProgramProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Ajouter bloc Variable' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ajouter bloc Opération' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ajouter bloc Condition' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ajouter bloc Si...Alors' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ajouter bloc Boucle' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ajouter bloc Mutex' }),
    ).toBeInTheDocument();

    const icons = document.querySelectorAll('[aria-hidden="true"] svg');
    expect(icons.length).toBeGreaterThanOrEqual(6);
  });
});
