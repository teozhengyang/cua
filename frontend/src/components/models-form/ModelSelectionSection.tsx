import type { ModelSelectionSectionProps } from "../../types/ModelsFormType";

const ModelSelectionSection = ({
  modelType,
  plannerModel,
  actorModel,
  setModelType,
  setPlannerModel,
  setActorModel
}: ModelSelectionSectionProps) => (
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
);

export default ModelSelectionSection;