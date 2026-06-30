import { BlockPalette } from './BlockPalette';
import { Panel } from '../ui/Panel';

type BlockPalettePanelProps = {
  className?: string;
};

export function BlockPalettePanel({ className = '' }: BlockPalettePanelProps) {
  return (
    <Panel title="Palette de blocs" className={className}>
      <BlockPalette />
    </Panel>
  );
}
