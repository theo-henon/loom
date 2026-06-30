import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ExecutionControls } from '../../src/components/execution/ExecutionControls';
import { ExecutionProvider } from '../../src/hooks/ExecutionProvider';
import { ProgramProvider } from '../../src/hooks/ProgramProvider';
import { useExecutionController } from '../../src/hooks/useExecution';

function ControlsHarness() {
  const execution = useExecutionController();
  return (
    <ExecutionProvider value={execution}>
      <ExecutionControls />
    </ExecutionProvider>
  );
}

describe('ExecutionControls', () => {
  it('renders the speed selector with three options', async () => {
    const user = userEvent.setup();
    render(
      <ProgramProvider>
        <ControlsHarness />
      </ProgramProvider>,
    );

    const select = screen.getByRole('combobox', {
      name: "Vitesse d'exécution",
    });
    expect(select).toHaveValue('normal');

    await user.selectOptions(select, 'fast');
    expect(select).toHaveValue('fast');
  });
});
