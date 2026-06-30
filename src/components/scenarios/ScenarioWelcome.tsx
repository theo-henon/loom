import { SCENARIOS, createBlankProgramLanes } from '../../scenarios';
import type { Scenario } from '../../scenarios';
import { useProgram } from '../../hooks/useProgram';
import { ScenarioCard } from './ScenarioCard';
import { Button } from '../ui/Button';

type ScenarioWelcomeProps = {
  onEnter: () => void;
};

export function ScenarioWelcome({ onEnter }: ScenarioWelcomeProps) {
  const { loadScenario } = useProgram();

  const handleSelect = (scenario: Scenario) => {
    loadScenario(scenario.lanes, scenario.id);
    onEnter();
  };

  const handleBlank = () => {
    loadScenario(createBlankProgramLanes(), null);
    onEnter();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Loom</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visualise la concurrence — choisis un scénario pour commencer.
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-1">
          {SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={handleBlank}>
            Ou commencer avec un éditeur vide
          </Button>
        </div>
      </main>
    </div>
  );
}
