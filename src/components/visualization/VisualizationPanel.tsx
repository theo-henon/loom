import { SharedVariablesPanel } from './SharedVariablesPanel';
import { TimelinePanel } from './TimelinePanel';
import { Panel } from '../ui/Panel';

type VisualizationPanelProps = {
  className?: string;
};

export function VisualizationPanel({
  className = '',
}: VisualizationPanelProps) {
  return (
    <Panel title="Visualisation" className={className}>
      <div className="space-y-4">
        <TimelinePanel />
        <SharedVariablesPanel />
      </div>
    </Panel>
  );
}
