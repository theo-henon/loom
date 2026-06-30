import { Panel } from '../ui/Panel';

type VisualizationPanelProps = {
  className?: string;
};

export function VisualizationPanel({
  className = '',
}: VisualizationPanelProps) {
  return (
    <Panel title="Visualisation" className={className}>
      <p className="text-sm text-gray-400">
        La timeline et les indicateurs apparaîtront ici.
      </p>
    </Panel>
  );
}
