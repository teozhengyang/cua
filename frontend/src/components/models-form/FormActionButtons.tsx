import { memo } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { APP_CONFIG } from "../../constants";

interface FormActionButtonsProps {
  handleClear: () => void;
  submittedConfig: boolean;
  isSubmitting?: boolean;
  isFormValid?: boolean;
}

const FormActionButtons = memo(({ 
  handleClear, 
  submittedConfig, 
  isSubmitting = false,
  isFormValid = true 
}: FormActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-3 mt-8">
      <button 
        type="submit" 
        disabled={isSubmitting || !isFormValid}
        className="w-full px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:focus:ring-0"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Starting...
          </div>
        ) : (
          APP_CONFIG.BUTTONS.START_AGENT
        )}
      </button>
      
      {submittedConfig && (
        <button
          type="button"
          onClick={handleClear}
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          {APP_CONFIG.BUTTONS.RESET_FORM}
        </button>
      )}
    </div>
  );
});

FormActionButtons.displayName = 'FormActionButtons';

export default FormActionButtons;