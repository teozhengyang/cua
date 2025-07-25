import type { ModelSelectionSectionProps } from "../../types/ModelsFormType";

const ModelSelectionSection = ({
  modelType,
  plannerModel,
  actorModel,
  setModelType,
  setPlannerModel,
  setActorModel
}: ModelSelectionSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-end">
      {/* Dropdown for selecting model type */}
      <div className="form-control w-full">
        <label className="label label-text font-medium mb-1">Model Type</label>
        <select
          className="select select-bordered w-full"
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
        >
          <option value="Unified">Unified</option>
          <option value="Planner + Actor">Planner + Actor</option>
        </select>
      </div>

      {/* Conditional dropdowns for Planner and Actor models */}
      {modelType !== "Unified" && (
        <>
          <div className="form-control w-full">
            <label className="label label-text font-medium mb-1">Planner</label>
            <select
              className="select select-bordered w-full"
              value={plannerModel}
              onChange={(e) => setPlannerModel(e.target.value)}
            >
              <option value="GPT">GPT</option>
              <option value="Qwen">Qwen</option>
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
              <option value="UI-TARS">UI-TARS</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default ModelSelectionSection;