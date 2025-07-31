import type { ModelSelectionSectionProps } from "../../types/ModelsFormType";

const ModelSelectionSection = ({
  modelType,
  plannerModel,
  actorModel,
  qwenDeploymentType,
  setModelType,
  setPlannerModel,
  setActorModel,
  setQwenDeploymentType
}: ModelSelectionSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Model Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Model Type
        </label>
        <select
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
        >
          <option value="Unified">Unified Model</option>
          <option value="Planner + Actor">Planner + Actor</option>
        </select>
      </div>

      {/* Planner + Actor Configuration */}
      {modelType === "Planner + Actor" && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
            Configuration Settings
          </h3>
          
          {/* Planner Model Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Planner Model
            </label>
            <div className="space-y-2 pt-1 pb-2">
              <label className="flex items-center p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 mr-3"
                  value="GPT"
                  checked={plannerModel === "GPT"}
                  onChange={(e) => setPlannerModel(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">OpenAI GPT</div>
                </div>
              </label>
              <label className="flex items-center p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 mr-3"
                  value="Qwen"
                  checked={plannerModel === "Qwen"}
                  onChange={(e) => setPlannerModel(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Qwen</div>
                </div>
              </label>
            </div>
          </div>

          {/* Qwen Deployment Type */}
          {plannerModel === "Qwen" && (
            <div className="pl-6 space-y-3">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                Deployment Type
              </label>
              <div className="space-y-2 mb-2">
                <label className="flex items-center p-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    className="w-4 h-4 text-green-600 border-slate-300 dark:border-slate-600 focus:ring-green-500 mr-3"
                    value="local"
                    checked={qwenDeploymentType === "local"}
                    onChange={(e) => setQwenDeploymentType(e.target.value as 'local' | 'api-based')}
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Local Deployment</div>
                  </div>
                </label>
                <label className="flex items-center p-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    className="w-4 h-4 text-green-600 border-slate-300 dark:border-slate-600 focus:ring-green-500 mr-3"
                    value="api-based"
                    checked={qwenDeploymentType === "api-based"}
                    onChange={(e) => setQwenDeploymentType(e.target.value as 'local' | 'api-based')}
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">API-based</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Actor Model Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Actor Model
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="w-4 h-4 text-purple-600 border-slate-300 dark:border-slate-600 focus:ring-purple-500 mr-3"
                  value="ShowUI"
                  checked={actorModel === "ShowUI"}
                  onChange={(e) => setActorModel(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">ShowUI</div>
                </div>
              </label>
              <label className="flex items-center p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="w-4 h-4 text-purple-600 border-slate-300 dark:border-slate-600 focus:ring-purple-500 mr-3"
                  value="UI-TARS"
                  checked={actorModel === "UI-TARS"}
                  onChange={(e) => setActorModel(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">UI-TARS</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelSelectionSection;