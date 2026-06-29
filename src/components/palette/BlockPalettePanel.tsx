import { Panel } from '../ui/Panel';

type BlockPalettePanelProps = {
  className?: string;
};

export function BlockPalettePanel({ className = '' }: BlockPalettePanelProps) {
  return (
    <Panel title="Palette de blocs" className={className}>
      <p className="text-sm text-gray-400">
        Les blocs disponibles apparaîtront ici.
      </p>
    </Panel>
  );
}
