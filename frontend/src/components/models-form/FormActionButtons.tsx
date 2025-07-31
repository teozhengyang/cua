import type { FormActionButtonsProps } from "../../types/ModelsFormType";

const FormActionButtons = ({ handleClear, submittedConfig }: FormActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-3 mt-8">
      {/* Button to start the agent */}
      <button 
        type="submit" 
        className="w-full px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200 font-medium text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        Start Agent
      </button>
      {/* Button to reset the agent, only shown if submittedConfig is available */}
      {/* This button clears the form and resets the state */}
      {submittedConfig && (
        <button
          type="button"
          onClick={handleClear}
          className="w-full px-6 py-3 bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 font-medium text-sm rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Reset Configuration
        </button>
      )}
    </div>
  );
}

export default FormActionButtons;