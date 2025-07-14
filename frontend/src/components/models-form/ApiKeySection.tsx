import type { ApiKeySectionProps } from "../../types/ModelsFormType";

const ApiKeySection = ({
  modelType,
  plannerApiKey,
  actorApiKey,
  setPlannerApiKey,
  setActorApiKey
}: ApiKeySectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-end">
    <div className="form-control w-full">
      <label className="label label-text font-medium mb-1">
        {modelType === "unified" ? "Claude API Key" : "Planner API Key"}
      </label>
      <input
        type="password"
        className="input input-bordered w-full"
        placeholder="Enter planner API key"
        value={plannerApiKey}
        onChange={(e) => setPlannerApiKey(e.target.value)}
      />
    </div>

    {modelType !== "unified" && (
      <div className="form-control w-full">
        <label className="label label-text font-medium mb-1">Actor API Key</label>
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="Enter actor API key"
          value={actorApiKey}
          onChange={(e) => setActorApiKey(e.target.value)}
        />
      </div>
    )}
  </div>
);

export default ApiKeySection;