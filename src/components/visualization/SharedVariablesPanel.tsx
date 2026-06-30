import { useExecution } from '../../hooks/useExecution';
import { useProgram } from '../../hooks/useProgram';
import type { ThreadStatus } from '../../types/execution';

const STATUS_LABELS: Record<ThreadStatus, string> = {
  idle: 'En attente',
  running: 'En cours',
  blocked: 'Bloqué',
  done: 'Terminé',
};

export function SharedVariablesPanel() {
  const { state } = useExecution();
  const { state: programState } = useProgram();
  const entries = Object.entries(state.variables);

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Variables partagées
        </h3>
        {entries.length === 0 ? (
          <p className="text-sm text-gray-400">
            Aucune variable pour l&apos;instant.
          </p>
        ) : (
          <ul className="space-y-1">
            {entries.map(([name, value]) => (
              <li
                key={name}
                className="rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm"
              >
                {name} = {value}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          État des threads
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          {programState.lanes.map((lane) => {
            const thread = state.threads[lane.id];
            const status = thread?.status ?? 'idle';
            return (
              <li key={lane.id}>
                {lane.name} — {STATUS_LABELS[status]}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
