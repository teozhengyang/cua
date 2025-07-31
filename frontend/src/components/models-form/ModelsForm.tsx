import { useModelsFormState } from "../../hooks/useModelsFormState";
import ModelSelectionSection from "./ModelSelectionSection";
import ApiKeySection from "./ApiKeySection";
import FormActionButtons from "./FormActionButtons";
import SubmittedConfigDisplay from "./SubmittedConfigDisplay";
import type { ModelsFormProps } from "../../types/ModelsFormType";

const ModelsForm = ({ onSubmit } : ModelsFormProps)  => {
  // Custom hook useModelsFormState to manage form state and submission
  const form = useModelsFormState(onSubmit);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Models Configuration</h2>
      {/* Form to select models and API keys */}
      <form
        onSubmit={form.handleSubmit}
        className="space-y-4 p-6 bg-base-200 rounded-lg shadow-md w-full"
      >
        <ModelSelectionSection {...form} />
        <ApiKeySection {...form} />
        <FormActionButtons {...form} submittedConfig={!!form.submittedConfig} />
        {form.submittedConfig && <SubmittedConfigDisplay config={form.submittedConfig} />}
      </form>
    </>

  );
};

export default ModelsForm;