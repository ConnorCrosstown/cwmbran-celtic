interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'spinner-celtic-sm' : size === 'lg' ? 'spinner-celtic-lg' : '';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`spinner-celtic ${sizeClass}`} />
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{text}</p>
      )}
    </div>
  );
}
