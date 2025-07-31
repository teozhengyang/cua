import { memo } from "react";
import type { SubmittedConfigProps } from "../../types/ModelsFormType";
import { maskSensitiveConfig } from "../../utils";

const SubmittedConfigDisplay = memo<SubmittedConfigProps>(({ config }) => {
  const maskedConfig = maskSensitiveConfig(config);
  
  return (
    <div className="mt-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 max-h-48 overflow-auto">
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-800 dark:text-slate-200 mb-3">
          Active Configuration
        </h3>

        {config.modelType === "Unified" && (
          <div className="p-3 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Model: Claude
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                API Key: {maskedConfig.claudeApiKey}
              </span>
            </div>
          </div>
        )}
        
        {config.modelType === "Planner + Actor" && (
          <div className="p-3 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600"> 
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Models: {config.plannerModel} + {config.actorModel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SubmittedConfigDisplay.displayName = 'SubmittedConfigDisplay';

export default SubmittedConfigDisplay;
