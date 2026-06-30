import { useEditorLayout } from '../../hooks/editorLayoutContext';
import { Button } from '../ui/Button';

export function LayoutControls() {
  const { saveLayout, restoreDefaultLayout, layoutSaved } = useEditorLayout();

  return (
    <>
      <Button variant="secondary" onClick={saveLayout}>
        {layoutSaved ? 'Layout sauvegardé' : 'Sauvegarder layout'}
      </Button>
      <Button variant="ghost" onClick={restoreDefaultLayout}>
        Layout par défaut
      </Button>
    </>
  );
}
