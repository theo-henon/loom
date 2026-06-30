import type { Scenario } from '../../scenarios';
import { Button } from '../ui/Button';

type ScenarioCardProps = {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
};

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <span className="mb-2 inline-block w-fit rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
        {scenario.concept}
      </span>
      <h3 className="text-base font-semibold text-gray-900">{scenario.title}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">{scenario.description}</p>
      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={() => onSelect(scenario)}
      >
        Charger
      </Button>
    </article>
  );
}
