import { useState } from 'react';
import { ProgramProvider } from './hooks/ProgramProvider';
import { EditorLayoutProvider } from './hooks/EditorLayoutProvider';
import { ExecutionProvider } from './hooks/ExecutionProvider';
import {
  getLanesSignature,
  useExecutionController,
} from './hooks/useExecution';
import { useProgram } from './hooks/useProgram';
import { MainWorkspaceLayout } from './components/layout/MainWorkspaceLayout';
import { ExecutionControls } from './components/execution/ExecutionControls';
import { ScenarioWelcome } from './components/scenarios/ScenarioWelcome';
import { ScenarioPickerModal } from './components/scenarios/ScenarioPickerModal';
import { Button } from './components/ui/Button';
import { getScenarioById } from './scenarios';

function AppContent() {
  const [showScenarioPicker, setShowScenarioPicker] = useState(false);
  const { state } = useProgram();
  const activeScenario = state.activeScenarioId
    ? getScenarioById(state.activeScenarioId)
    : null;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Loom</h1>
          {activeScenario ? (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {activeScenario.title}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowScenarioPicker(true)}
          >
            Charger un scénario
          </Button>
          <ExecutionControls />
        </div>
      </header>
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <MainWorkspaceLayout />
      </main>

      {showScenarioPicker ? (
        <ScenarioPickerModal onClose={() => setShowScenarioPicker(false)} />
      ) : null}
    </div>
  );
}

function ExecutionShell() {
  const execution = useExecutionController();

  return (
    <ExecutionProvider value={execution}>
      <AppContent />
    </ExecutionProvider>
  );
}

function AppWithExecution() {
  const { state } = useProgram();
  const lanesSignature = getLanesSignature(state.lanes);

  return <ExecutionShell key={lanesSignature} />;
}

function AppShell() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <ScenarioWelcome onEnter={() => setEntered(true)} />;
  }

  return <AppWithExecution />;
}

export function App() {
  return (
    <ProgramProvider>
      <EditorLayoutProvider>
        <AppShell />
      </EditorLayoutProvider>
    </ProgramProvider>
  );
}
