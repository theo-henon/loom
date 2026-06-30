import { SharedVariablesPanel } from './SharedVariablesPanel';
import { Panel } from '../ui/Panel';

type VisualizationPanelProps = {
  className?: string;
};

export function VisualizationPanel({
  className = '',
}: VisualizationPanelProps) {
  return (
    <Panel title="Visualisation" className={className}>
      <SharedVariablesPanel />
    </Panel>
  );
}
