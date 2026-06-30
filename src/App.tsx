import { ProgramProvider } from './hooks/ProgramProvider';
import { ExecutionProvider } from './hooks/ExecutionProvider';
import {
  getLanesSignature,
  useExecutionController,
} from './hooks/useExecution';
import { useProgram } from './hooks/useProgram';
import { BlockPalettePanel } from './components/palette/BlockPalettePanel';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { LaneEditor } from './components/lanes/LaneEditor';
import { ExecutionControls } from './components/execution/ExecutionControls';
import { Panel } from './components/ui/Panel';

function AppContent() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">Loom</h1>
        <ExecutionControls />
      </header>
      <main className="flex flex-1 overflow-hidden">
        <BlockPalettePanel className="w-60 shrink-0" />
        <Panel title="Éditeur de lanes" className="flex-1">
          <LaneEditor />
        </Panel>
        <VisualizationPanel className="w-80 shrink-0" />
      </main>
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

export function App() {
  return (
    <ProgramProvider>
      <AppWithExecution />
    </ProgramProvider>
  );
}
