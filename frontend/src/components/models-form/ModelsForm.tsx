import { useModelsFormState } from "../../hooks/useModelsFormState";
import ModelsFormHeader from "./ModelsFormHeader";
import ModelsFormContent from "./ModelsFormContent";
import type { ModelsFormProps } from "../../types/ModelsFormType";

const ModelsForm = ({ onSubmit, onClose } : ModelsFormProps)  => {
  // Custom hook useModelsFormState to manage form state and submission
  const form = useModelsFormState(onSubmit);

  return (
    <div className="h-full flex flex-col">
      <ModelsFormHeader 
        hasSubmittedConfig={!!form.submittedConfig}
        onClose={onClose}
      />
      
      <ModelsFormContent 
        isVisible={true}
        form={form}
      />
    </div>
  );
};

export default ModelsForm;