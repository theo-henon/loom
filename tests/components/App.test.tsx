import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from '../../src/App';

async function enterEditorFromWelcome(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', { name: 'Ou commencer avec un éditeur vide' }),
  );
}

describe('App editor', () => {
  it('shows the scenario welcome screen first', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Loom' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Parallélisme simple' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Race condition' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Deadlock' }),
    ).toBeInTheDocument();
  });

  it('renders the layout with three panels after entering the editor', async () => {
    const user = userEvent.setup();
    render(<App />);

    await enterEditorFromWelcome(user);

    expect(screen.getByText('Palette de blocs')).toBeInTheDocument();
    expect(screen.getByText('Éditeur de lanes')).toBeInTheDocument();
    expect(screen.getByText('Visualisation')).toBeInTheDocument();
  });

  it('loads deadlock scenario from the welcome screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    const deadlockCard = screen
      .getByRole('heading', { name: 'Deadlock' })
      .closest('article') as HTMLElement;
    await user.click(
      within(deadlockCard).getByRole('button', { name: 'Charger' }),
    );

    expect(screen.getByDisplayValue('Thread A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Thread B')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Charger un scénario' }),
    ).toBeInTheDocument();
  });

  it('adds a variable block when clicking the palette', async () => {
    const user = userEvent.setup();
    render(<App />);

    await enterEditorFromWelcome(user);

    const palette = screen.getByRole('region', { name: 'Palette de blocs' });
    await user.click(
      within(palette).getByRole('button', { name: 'Ajouter bloc Variable' }),
    );

    expect(screen.getByText('Valeur initiale')).toBeInTheDocument();
  });

  it('adds a lane when clicking the add button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await enterEditorFromWelcome(user);

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
