import { useState } from 'react';
import { useProgram } from '../../hooks/useProgram';
import { buildShareUrl } from '../../share/url';
import { Button } from '../ui/Button';

export function ShareButton() {
  const { state } = useProgram();
  const [feedback, setFeedback] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleShare = async () => {
    const url = buildShareUrl({
      lanes: state.lanes,
      activeScenarioId: state.activeScenarioId,
      programTitle: state.programTitle,
      baseUrl: `${window.location.origin}${window.location.pathname}`,
    });

    if (!url) {
      setFeedback('error');
      window.setTimeout(() => setFeedback('idle'), 2500);
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setFeedback('copied');
      window.setTimeout(() => setFeedback('idle'), 2500);
    } catch {
      setFeedback('error');
      window.setTimeout(() => setFeedback('idle'), 2500);
    }
  };

  const label =
    feedback === 'copied'
      ? 'Lien copié !'
      : feedback === 'error'
        ? 'Impossible de copier'
        : 'Partager';

  return (
    <Button variant="secondary" onClick={() => void handleShare()}>
      {label}
    </Button>
  );
}
