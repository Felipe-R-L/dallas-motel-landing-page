interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className = 'w-8 h-8' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin ${className}`}
    />
  );
}
