import type { FormActionButtonsProps } from "../../types/ModelsFormType";

const FormActionButtons = ({ handleClear, submittedConfig }: FormActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Button to start the agent */}
      <button type="submit" className="btn btn-primary w-full">
        Start Agent
      </button>
      {/* Button to reset the agent, only shown if submittedConfig is available */}
      {/* This button clears the form and resets the state */}
      {submittedConfig && (
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-secondary w-full mt-2"
        >
          Reset Agent
        </button>
      )}
    </div>
  );
}

export default FormActionButtons;