import { memo } from 'react';

interface ValidationErrorsProps {
  errors: string[];
  onDismiss?: () => void;
  className?: string;
}

const ValidationErrors = memo(({ 
  errors, 
  onDismiss, 
  className = '' 
}: ValidationErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-red-800 dark:text-red-200 font-medium text-sm mb-2">
            {errors.length === 1 ? 'Validation Error' : 'Validation Errors'}
          </h3>
          <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors"
            aria-label="Dismiss errors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

ValidationErrors.displayName = 'ValidationErrors';

export default ValidationErrors;
