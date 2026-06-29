import { BlockPalettePanel } from './components/palette/BlockPalettePanel';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { Panel } from './components/ui/Panel';

export function App() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">Loom</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <BlockPalettePanel className="w-60 shrink-0" />
        <Panel title="Éditeur de lanes" className="flex-1">
          <p className="text-sm text-gray-400">Les lanes apparaîtront ici.</p>
        </Panel>
        <VisualizationPanel className="w-80 shrink-0" />
      </main>
    </div>
  );
}
