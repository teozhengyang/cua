import type { ApiKeySectionProps } from "../../types/ModelsFormType";

const ApiKeySection = ({
  modelType,
  plannerModel,
  actorModel,
  qwenDeploymentType,
  claudeApiKey,
  plannerApiKey,
  plannerFolderPath,
  actorFolderPath,
  actorServerUrl,
  setClaudeApiKey,
  setPlannerApiKey,
  setPlannerFolderPath,
  setActorFolderPath,
  setActorServerUrl
}: ApiKeySectionProps) => {
  return (
    <div className="space-y-4">
      {/* Unified Model Configuration */}
      {modelType === "Unified" && (
        <div className="form-control w-full">
          <label className="label label-text font-medium mb-1">Claude API Key</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Enter Claude API key"
            value={claudeApiKey}
            onChange={(e) => setClaudeApiKey(e.target.value)}
          />
        </div>
      )}

      {/* Planner + Actor Configuration */}
      {modelType === "Planner + Actor" && (
        <div className="space-y-4">
          {/* Planner Configuration */}
          <div className="p-4 bg-base-300 rounded-lg">
            <h4 className="font-medium mb-3">Planner Configuration</h4>
            {plannerModel === "GPT" && (
              <div className="form-control w-full">
                <label className="label label-text font-medium mb-1">GPT API Key</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter GPT API key"
                  value={plannerApiKey}
                  onChange={(e) => setPlannerApiKey(e.target.value)}
                />
              </div>
            )}
            {plannerModel === "Qwen" && qwenDeploymentType === "local" && (
              <div className="form-control w-full">
                <label className="label label-text font-medium mb-1">Qwen Local Folder Path</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter local folder path for Qwen"
                  value={plannerFolderPath}
                  onChange={(e) => setPlannerFolderPath(e.target.value)}
                />
              </div>
            )}
            {plannerModel === "Qwen" && qwenDeploymentType === "api-based" && (
              <div className="form-control w-full">
                <label className="label label-text font-medium mb-1">Qwen API Key</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter Qwen API key"
                  value={plannerApiKey}
                  onChange={(e) => setPlannerApiKey(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Actor Configuration */}
          <div className="p-4 bg-base-300 rounded-lg">
            <h4 className="font-medium mb-3">Actor Configuration</h4>
            {actorModel === "ShowUI" && (
              <div className="form-control w-full">
                <label className="label label-text font-medium mb-1">ShowUI Folder Path</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter ShowUI folder path"
                  value={actorFolderPath}
                  onChange={(e) => setActorFolderPath(e.target.value)}
                />
              </div>
            )}
            {actorModel === "UI-TARS" && (
              <div className="form-control w-full">
                <label className="label label-text font-medium mb-1">UI-TARS Server URL</label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  placeholder="Enter UI-TARS server URL"
                  value={actorServerUrl}
                  onChange={(e) => setActorServerUrl(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiKeySection;
