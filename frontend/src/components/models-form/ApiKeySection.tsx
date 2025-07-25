import type { ApiKeySectionProps } from "../../types/ModelsFormType";

const ApiKeySection = ({
  modelType,
  plannerApiKey,
  actorApiKey,
  setPlannerApiKey,
  setActorApiKey
}: ApiKeySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-end">
      {/* Input field for Claude/Planner API Key */}
      <div className="form-control w-full">
        <label className="label label-text font-medium mb-1">
          {modelType === "Unified" ? "Claude API Key" : "Planner API Key"}
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="Enter API key"
          value={plannerApiKey}
          onChange={(e) => setPlannerApiKey(e.target.value)}
        />
      </div>
      
      {/* Input field for Actor API Key, only shown if modelType is not Unified */}
      {modelType !== "Unified" && (
        <div className="form-control w-full">
          <label className="label label-text font-medium mb-1">Actor API Key</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Enter API key"
            value={actorApiKey}
            onChange={(e) => setActorApiKey(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default ApiKeySection;
