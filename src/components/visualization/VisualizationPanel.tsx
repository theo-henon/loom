import type { CSSProperties } from 'react';
import { SharedVariablesPanel } from './SharedVariablesPanel';
import { TimelinePanel } from './TimelinePanel';
import { Panel } from '../ui/Panel';

type VisualizationPanelProps = {
  className?: string;
  style?: CSSProperties;
};

export function VisualizationPanel({
  className = '',
  style,
}: VisualizationPanelProps) {
  return (
    <Panel title="Visualisation" className={className} style={style}>
      <div className="space-y-4">
        <TimelinePanel />
        <SharedVariablesPanel />
      </div>
    </Panel>
  );
}
