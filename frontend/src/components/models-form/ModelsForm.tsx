import { memo } from "react";
import { useModelsFormState } from "../../hooks/useModelsFormState";
import ModelsFormHeader from "./ModelsFormHeader";
import ModelsFormContent from "./ModelsFormContent";
import ValidationErrors from "../common/ValidationErrors";
import type { ModelsFormProps } from "../../types/ModelsFormType";

const ModelsForm = memo<ModelsFormProps>(({ onSubmit, onClose }) => {
  const form = useModelsFormState(onSubmit);

  return (
    <div className="h-full flex flex-col">
      <ModelsFormHeader 
        hasSubmittedConfig={!!form.submittedConfig}
        onClose={onClose}
      />
      
      {form.validationErrors.length > 0 && (
        <div className="flex-shrink-0 p-4">
          <ValidationErrors 
            errors={form.validationErrors} 
            onDismiss={form.clearValidationErrors}
          />
        </div>
      )}
      
      <ModelsFormContent 
        isVisible={true}
        form={form}
      />
    </div>
  );
});

ModelsForm.displayName = 'ModelsForm';

export default ModelsForm;