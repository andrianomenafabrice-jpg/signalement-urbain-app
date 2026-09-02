interface Props {
  className?: string;
}

export function Squelette({ className = '' }: Props) {
  return <div className={`animate-pulse bg-encre-urbaine/10 dark:bg-beton/10 rounded ${className}`} />;
}