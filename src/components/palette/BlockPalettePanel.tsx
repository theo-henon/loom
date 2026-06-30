import type { CSSProperties } from 'react';
import { BlockPalette } from './BlockPalette';
import { Panel } from '../ui/Panel';

type BlockPalettePanelProps = {
  className?: string;
  style?: CSSProperties;
};

export function BlockPalettePanel({
  className = '',
  style,
}: BlockPalettePanelProps) {
  return (
    <Panel title="Palette de blocs" className={className} style={style}>
      <BlockPalette />
    </Panel>
  );
}
