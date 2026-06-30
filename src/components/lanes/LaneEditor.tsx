import { useProgram } from '../../hooks/useProgram';
import { Button } from '../ui/Button';
import { Lane } from './Lane';

export function LaneEditor() {
  const { state, addLane } = useProgram();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <p className="text-sm text-gray-500" aria-label="Nombre de lanes">
          {state.lanes.length} lane{state.lanes.length > 1 ? 's' : ''}
        </p>
        <Button variant="primary" onClick={addLane}>
          + Ajouter une lane
        </Button>
      </div>

      {state.lanes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300">
          <p className="text-sm text-gray-400">
            Aucune lane — ajoutez-en une pour commencer.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 gap-4 overflow-x-auto pb-2">
          {state.lanes.map((lane) => (
            <Lane
              key={lane.id}
              lane={lane}
              isSelected={state.selectedLaneId === lane.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
