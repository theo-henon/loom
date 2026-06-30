import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from '../../src/App';

describe('App editor', () => {
  it('renders the layout with three panels', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Loom' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Palette de blocs')).toBeInTheDocument();
    expect(screen.getByText('Éditeur de lanes')).toBeInTheDocument();
    expect(screen.getByText('Visualisation')).toBeInTheDocument();
  });

  it('adds a variable block when clicking the palette', async () => {
    const user = userEvent.setup();
    render(<App />);

    const palette = screen.getByRole('region', { name: 'Palette de blocs' });
    await user.click(
      within(palette).getByRole('button', { name: 'Ajouter bloc Variable' }),
    );

    expect(screen.getByText('Valeur initiale')).toBeInTheDocument();
  });

  it('adds a lane when clicking the add button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const editor = screen.getByRole('region', { name: 'Éditeur de lanes' });
    expect(within(editor).getByLabelText('Nombre de lanes')).toHaveTextContent(
      '2 lanes',
    );

    await user.click(
      screen.getByRole('button', { name: '+ Ajouter une lane' }),
    );

    await waitFor(() => {
      const updatedEditor = screen.getByRole('region', {
        name: 'Éditeur de lanes',
      });
      expect(
        within(updatedEditor).getByLabelText('Nombre de lanes'),
      ).toHaveTextContent('3 lanes');
    });
  });
});
