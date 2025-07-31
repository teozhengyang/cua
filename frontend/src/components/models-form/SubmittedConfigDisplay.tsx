import type { SubmittedConfigProps } from "../../types/ModelsFormType";

const SubmittedConfigDisplay = ({ config }: SubmittedConfigProps) => {
  return (
    <div className="p-4 mt-2 bg-base-300 rounded-lg shadow max-h-40 overflow-auto text-sm">
      {/* Display the submitted configuration details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Current Configuration</h3>
        <div>
          <strong>Model Type:</strong> {config.modelType}
        </div>
        
        {config.modelType === "Planner + Actor" && (
          <>
            <div>
              <strong>Planner Model:</strong> {config.plannerModel}
            </div>

            <div>
              <strong>Actor Model:</strong> {config.actorModel}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmittedConfigDisplay;
