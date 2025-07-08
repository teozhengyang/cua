import { useState, useEffect } from "react";

const ModelForm = ({ onSubmit }) => {
  const [modelType, setModelType] = useState("unified");
  const [plannerModel, setPlannerModel] = useState("claude");
  const [actorModel, setActorModel] = useState("claude");
  const [plannerApiKey, setPlannerApiKey] = useState("");
  const [actorApiKey, setActorApiKey] = useState("");

  useEffect(() => {
    if (modelType === "unified") {
      setPlannerModel("claude");
      setActorModel("claude");
    }
  }, [modelType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      modelType,
      plannerModel,
      actorModel,
      plannerApiKey,
      actorApiKey: modelType === "unified" ? plannerApiKey : actorApiKey,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-base-200 rounded-lg shadow">
      {/* Model Type Dropdown */}
      <div className="form-control">
        <label className="label mr-2">Model Type</label>
        <select
          className="select select-bordered"
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
        >
          <option value="unified">Unified</option>
          <option value="planner+actor">Planner + Actor</option>
        </select>
      </div>

      {/* Planner & Actor Dropdowns if not Unified */}
      {modelType !== "unified" && (
        <>
          <div className="form-control">
            <label className="label mr-2">Planner</label>
            <select
              className="select select-bordered"
              value={plannerModel}
              onChange={(e) => setPlannerModel(e.target.value)}
            >
              <option value="gpt">GPT</option>
              <option value="qwen">Qwen</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label mr-2">Actor</label>
            <select
              className="select select-bordered"
              value={actorModel}
              onChange={(e) => setActorModel(e.target.value)}
            >
              <option value="showUI">ShowUI</option>
              <option value="ui-tars">UI-TARS</option>
            </select>
          </div>
        </>
      )}

      {/* API Key Fields */}
      {modelType === "unified" ? (
        <div className="form-control">
          <label className="label mr-2">Claude API Key</label>
          <input
            type="password"
            className="input input-bordered"
            placeholder="Enter Claude API key"
            value={plannerApiKey}
            onChange={(e) => setPlannerApiKey(e.target.value)}
          />
        </div>
      ) : (
        <>
          <div className="form-control">
            <label className="label mr-2">Planner API Key</label>
            <input
              type="password"
              className="input input-bordered"
              placeholder="Enter planner API key"
              value={plannerApiKey}
              onChange={(e) => setPlannerApiKey(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label mr-2">Actor API Key</label>
            <input
              type="password"
              className="input input-bordered"
              placeholder="Enter actor API key"
              value={actorApiKey}
              onChange={(e) => setActorApiKey(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-full">
        Start Agent
      </button>
    </form>
  );
};

export default ModelForm;
