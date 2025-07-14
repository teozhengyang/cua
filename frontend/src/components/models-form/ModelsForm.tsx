import { useModelsFormState } from "../../hooks/useModelsFormState";
import ModelSelectionSection from "./ModelSelectionSection";
import ApiKeySection from "./ApiKeySection";
import FormActionButtons from "./FormActionButtons";
import SubmittedConfigDisplay from "./SubmittedConfigDisplay";
import type { ModelsFormProps } from "../../types/ModelsFormType";

const ModelsForm: React.FC<ModelsFormProps> = ({ onSubmit }) => {
  const form = useModelsFormState(onSubmit);

  return (
    <form
      onSubmit={form.handleSubmit}
      className="space-y-4 p-6 bg-base-200 rounded-lg shadow-md w-full"
    >
      <ModelSelectionSection {...form} />
      <ApiKeySection {...form} />
      <FormActionButtons {...form} submittedConfig={!!form.submittedConfig} />
      {form.submittedConfig && <SubmittedConfigDisplay config={form.submittedConfig} />}
    </form>
  );
};

export default ModelsForm;