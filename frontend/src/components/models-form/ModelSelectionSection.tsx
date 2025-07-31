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
    <div className="space-y-4">
      {/* Model Type Selection */}
      <div className="form-control w-full">
        <label className="label label-text font-medium mb-1">Model Type</label>
        <select
          className="select select-bordered w-full"
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
        >
          <option value="Unified">Unified Model</option>
          <option value="Planner + Actor">Planner + Actor</option>
        </select>
      </div>

      {/* Planner + Actor Configuration */}
      {modelType === "Planner + Actor" && (
        <div className="space-y-4 p-4 bg-base-300 rounded-lg">
          <h3 className="font-semibold text-lg">Configuration</h3>
          
          {/* Planner Model Selection */}
          <div className="form-control w-full">
            <label className="label label-text font-medium mb-1">Planner Model</label>
            <div className="flex flex-col space-y-2">
              <label className="cursor-pointer label justify-start">
                <input
                  type="radio"
                  className="radio radio-primary mr-2"
                  value="GPT"
                  checked={plannerModel === "GPT"}
                  onChange={(e) => setPlannerModel(e.target.value)}
                />
                <span className="label-text">GPT (API Key required)</span>
              </label>
              <label className="cursor-pointer label justify-start">
                <input
                  type="radio"
                  className="radio radio-primary mr-2"
                  value="Qwen"
                  checked={plannerModel === "Qwen"}
                  onChange={(e) => setPlannerModel(e.target.value)}
                />
                <span className="label-text">Qwen</span>
              </label>
            </div>
          </div>

          {/* Qwen Deployment Type */}
          {plannerModel === "Qwen" && (
            <div className="form-control w-full ml-6">
              <label className="label label-text font-medium mb-1">Qwen Deployment</label>
              <div className="flex flex-col space-y-2">
                <label className="cursor-pointer label justify-start">
                  <input
                    type="radio"
                    className="radio radio-secondary mr-2"
                    value="local"
                    checked={qwenDeploymentType === "local"}
                    onChange={(e) => setQwenDeploymentType(e.target.value as 'local' | 'api-based')}
                  />
                  <span className="label-text">Local (Folder Path)</span>
                </label>
                <label className="cursor-pointer label justify-start">
                  <input
                    type="radio"
                    className="radio radio-secondary mr-2"
                    value="api-based"
                    checked={qwenDeploymentType === "api-based"}
                    onChange={(e) => setQwenDeploymentType(e.target.value as 'local' | 'api-based')}
                  />
                  <span className="label-text">API-based (API Key)</span>
                </label>
              </div>
            </div>
          )}

          {/* Actor Model Selection */}
          <div className="form-control w-full">
            <label className="label label-text font-medium mb-1">Actor Model</label>
            <div className="flex flex-col space-y-2">
              <label className="cursor-pointer label justify-start">
                <input
                  type="radio"
                  className="radio radio-primary mr-2"
                  value="ShowUI"
                  checked={actorModel === "ShowUI"}
                  onChange={(e) => setActorModel(e.target.value)}
                />
                <span className="label-text">ShowUI (Folder Path)</span>
              </label>
              <label className="cursor-pointer label justify-start">
                <input
                  type="radio"
                  className="radio radio-primary mr-2"
                  value="UI-TARS"
                  checked={actorModel === "UI-TARS"}
                  onChange={(e) => setActorModel(e.target.value)}
                />
                <span className="label-text">UI-TARS (Server URL)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelSelectionSection;