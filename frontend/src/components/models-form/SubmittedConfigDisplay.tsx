import type { SubmittedConfigProps } from "../../types/ModelsFormType";

const SubmittedConfigDisplay = ({ config }: SubmittedConfigProps) => (
  <div className="p-4 mt-2 bg-base-300 rounded-lg shadow max-h-40 overflow-auto text-sm">
    <h3 className="font-semibold mb-2">Models to Use</h3>
    <pre className="whitespace-pre-wrap">
      {JSON.stringify(
        {
          modelType: config.modelType,
          plannerModel: config.plannerModel,
          actorModel: config.actorModel,
          plannerApiKey: config.plannerApiKey ? "••••••••" : "(empty)",
          actorApiKey:
            config.modelType === "unified"
              ? "(same as planner)"
              : config.actorApiKey
              ? "••••••••"
              : "(empty)",
        },
        null,
        2
      )}
    </pre>
  </div>
);

export default SubmittedConfigDisplay;
