import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShareButton } from '../../src/components/share/ShareButton';
import { ProgramProvider } from '../../src/hooks/ProgramProvider';

describe('ShareButton', () => {
  it('renders the share action', () => {
    render(
      <ProgramProvider>
        <ShareButton />
      </ProgramProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Partager' }),
    ).toBeInTheDocument();
  });
});
