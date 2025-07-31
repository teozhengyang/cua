import type { SubmittedConfigProps } from "../../types/ModelsFormType";

const SubmittedConfigDisplay = ({ config }: SubmittedConfigProps) => {
  return (
    <div className="mt-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 max-h-48 overflow-auto">
      {/* Display the submitted configuration details */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-3">
          Current Configuration
        </h3>

        {config.modelType === "Unified" && (
          <div className="p-3 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Model: Claude</span>
          </div>
        )}
        
        {config.modelType === "Planner + Actor" && (
          <div className="p-3 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600"> 
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Model: {config.plannerModel} + {config.actorModel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmittedConfigDisplay;
