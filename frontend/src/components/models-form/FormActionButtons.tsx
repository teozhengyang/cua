import type { FormActionButtonsProps } from "../../types/ModelsFormType";

const FormActionButtons = ({ handleClear, submittedConfig }: FormActionButtonsProps) => (
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
        Reset Form
      </button>
    )}
  </div>
);

export default FormActionButtons;