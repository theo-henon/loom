import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../../src/App';

describe('App', () => {
  it('renders the layout with three panels', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Loom' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Palette de blocs')).toBeInTheDocument();
    expect(screen.getByText('Éditeur de lanes')).toBeInTheDocument();
    expect(screen.getByText('Visualisation')).toBeInTheDocument();
  });
});
