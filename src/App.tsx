import { useCallback, useState } from 'react';
import { ProgramProvider } from './hooks/ProgramProvider';
import { EditorLayoutProvider } from './hooks/EditorLayoutProvider';
import { ExecutionProvider } from './hooks/ExecutionProvider';
import {
  getLanesSignature,
  useExecutionController,
} from './hooks/useExecution';
import { useProgram } from './hooks/useProgram';
import { useSharedLinkLoader } from './hooks/useSharedLinkLoader';
import { MainWorkspaceLayout } from './components/layout/MainWorkspaceLayout';
import { LayoutControls } from './components/layout/LayoutControls';
import { ExecutionControls } from './components/execution/ExecutionControls';
import { ScenarioWelcome } from './components/scenarios/ScenarioWelcome';
import { ScenarioPickerModal } from './components/scenarios/ScenarioPickerModal';
import { ShareButton } from './components/share/ShareButton';
import { SharedLinkBanner } from './components/share/SharedLinkBanner';
import { Button } from './components/ui/Button';
import { getScenarioById } from './scenarios';

function AppContent({ isSharedLink }: { isSharedLink: boolean }) {
  const [showScenarioPicker, setShowScenarioPicker] = useState(false);
  const { state } = useProgram();
  const activeScenario = state.activeScenarioId
    ? getScenarioById(state.activeScenarioId)
    : null;
  const headerTitle = activeScenario?.title ?? state.programTitle;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <SharedLinkBanner visible={isSharedLink} />
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Loom</h1>
          {headerTitle ? (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {headerTitle}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          <Button
            variant="secondary"
            onClick={() => setShowScenarioPicker(true)}
          >
            Charger un scénario
          </Button>
          <LayoutControls />
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

function ExecutionShell({ isSharedLink }: { isSharedLink: boolean }) {
  const execution = useExecutionController();

  return (
    <ExecutionProvider value={execution}>
      <AppContent isSharedLink={isSharedLink} />
    </ExecutionProvider>
  );
}

function AppWithExecution({ isSharedLink }: { isSharedLink: boolean }) {
  const { state } = useProgram();
  const lanesSignature = getLanesSignature(state.lanes);

  return <ExecutionShell key={lanesSignature} isSharedLink={isSharedLink} />;
}

function AppShell() {
  const [entered, setEntered] = useState(false);
  const enter = useCallback(() => setEntered(true), []);
  const { isSharedLink, shareError } = useSharedLinkLoader(enter);

  if (!entered) {
    return (
      <>
        {shareError ? (
          <div className="border-b border-rose-100 bg-rose-50 px-6 py-2 text-xs text-rose-800">
            {shareError}
          </div>
        ) : null}
        <ScenarioWelcome onEnter={enter} />
      </>
    );
  }

  return <AppWithExecution isSharedLink={isSharedLink} />;
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
