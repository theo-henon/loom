import { SCENARIOS, createBlankProgramLanes } from '../../scenarios';
import type { Scenario } from '../../scenarios';
import { useProgram } from '../../hooks/useProgram';
import { ScenarioCard } from './ScenarioCard';
import { Button } from '../ui/Button';

type ScenarioPickerModalProps = {
  onClose: () => void;
};

export function ScenarioPickerModal({ onClose }: ScenarioPickerModalProps) {
  const { loadScenario } = useProgram();

  const handleSelect = (scenario: Scenario) => {
    loadScenario(scenario.lanes, scenario.id);
    onClose();
  };

  const handleBlank = () => {
    loadScenario(createBlankProgramLanes(), null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scenario-picker-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-gray-50 p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="scenario-picker-title"
              className="text-lg font-bold text-gray-900"
            >
              Charger un scénario
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Remplace le programme actuel par un exemple pédagogique.
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Fermer">
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          {SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={handleBlank}>
            Éditeur vide
          </Button>
        </div>
      </div>
    </div>
  );
}
