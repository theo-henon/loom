import { Button } from './Button';

type RemoveButtonProps = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
};

export function RemoveButton({
  label,
  onClick,
  disabled = false,
  className = '',
}: RemoveButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center p-0 text-lg leading-none ${className}`}
    >
      <span aria-hidden="true">×</span>
    </Button>
  );
}
