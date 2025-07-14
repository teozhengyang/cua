import { useState, useEffect } from "react";
import { handleModelSubmit } from "../../services/models-form/ModelsFormService";
import type { ModelFormConfig } from "../../types/ModelsFormType";

interface ModelsFormProps {
  onSubmit?: (config: ModelFormConfig) => void;
}

const ModelsForm: React.FC<ModelsFormProps> = ({ onSubmit }) => {
  const [modelType, setModelType] = useState("unified");
  const [plannerModel, setPlannerModel] = useState("claude");
  const [actorModel, setActorModel] = useState("claude");
  const [plannerApiKey, setPlannerApiKey] = useState("");
  const [actorApiKey, setActorApiKey] = useState("");
  const [submittedConfig, setSubmittedConfig] = useState<ModelFormConfig | null>(null);

  useEffect(() => {
    if (modelType === "unified") {
      setPlannerModel("claude");
      setActorModel("claude");
    } else {
      setPlannerModel("gpt");
      setActorModel("showUI");
    }
  }, [modelType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: ModelFormConfig = {
      modelType,
      plannerModel,
      actorModel,
      plannerApiKey,
      actorApiKey: modelType === "unified" ? plannerApiKey : actorApiKey,
    };

    handleModelSubmit(config);
    setSubmittedConfig(config);
    if (onSubmit) onSubmit(config);
  };

  const handleClear = () => {
    setSubmittedConfig(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-base-200 rounded-lg shadow-md w-full"
    >
      {/* Row 1: Model, Planner, Actor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-end">
        <div className="form-control w-full">
          <label className="label label-text font-medium mb-1">Model Type</label>
          <select
            className="select select-bordered w-full"
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
          >
            <option value="unified">Unified</option>
            <option value="planner+actor">Planner + Actor</option>
          </select>
        </div>

        {modelType !== "unified" && (
          <>
            <div className="form-control w-full">
              <label className="label label-text font-medium mb-1">Planner</label>
              <select
                className="select select-bordered w-full"
                value={plannerModel}
                onChange={(e) => setPlannerModel(e.target.value)}
              >
                <option value="gpt">GPT</option>
                <option value="qwen">Qwen</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label label-text font-medium mb-1">Actor</label>
              <select
                className="select select-bordered w-full"
                value={actorModel}
                onChange={(e) => setActorModel(e.target.value)}
              >
                <option value="showUI">ShowUI</option>
                <option value="ui-tars">UI-TARS</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Row 2: API Keys */}
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

      {/* Row 3: Buttons */}
      <div className="flex flex-col gap-2 mt-1">
        <button type="submit" className="btn btn-primary w-full">
          Start Agent
        </button>
        {submittedConfig && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary w-full mt-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Config Output */}
      {submittedConfig && (
        <div className="p-4 mt-2 bg-base-300 rounded-lg shadow max-h-40 overflow-auto text-sm">
          <h3 className="font-semibold mb-2">Submitted Config:</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(
              {
                modelType: submittedConfig.modelType,
                plannerModel: submittedConfig.plannerModel,
                actorModel: submittedConfig.actorModel,
                plannerApiKey: submittedConfig.plannerApiKey ? "••••••••" : "(empty)",
                actorApiKey:
                  submittedConfig.modelType === "unified"
                    ? "(same as planner)"
                    : submittedConfig.actorApiKey
                    ? "••••••••"
                    : "(empty)",
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </form>
  );
};

export default ModelsForm;
