import ModelSelectionSection from "./ModelSelectionSection";
import ApiKeySection from "./ApiKeySection";
import FormActionButtons from "./FormActionButtons";
import SubmittedConfigDisplay from "./SubmittedConfigDisplay";
import type { ModelFormConfig } from "../../types/ModelsFormType";

// Type for the form state returned by useModelsFormState
type ModelsFormState = {
  modelType: string;
  plannerModel: string;
  actorModel: string;
  qwenDeploymentType: 'local' | 'api-based';
  claudeApiKey: string;
  plannerApiKey: string;
  plannerFolderPath: string;
  actorFolderPath: string;
  actorServerUrl: string;
  submittedConfig: ModelFormConfig | null;
  setModelType: (value: string) => void;
  setPlannerModel: (value: string) => void;
  setActorModel: (value: string) => void;
  setQwenDeploymentType: (value: 'local' | 'api-based') => void;
  setClaudeApiKey: (value: string) => void;
  setPlannerApiKey: (value: string) => void;
  setPlannerFolderPath: (value: string) => void;
  setActorFolderPath: (value: string) => void;
  setActorServerUrl: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleClear: () => void;
};

interface ModelsFormContentProps {
  isVisible: boolean;
  form: ModelsFormState;
}

const ModelsFormContent = ({ isVisible, form }: ModelsFormContentProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto">
      <form onSubmit={form.handleSubmit} className="p-6 space-y-6">
        <ModelSelectionSection {...form} />
        <ApiKeySection {...form} />
        <FormActionButtons {...form} submittedConfig={!!form.submittedConfig} />
        {form.submittedConfig && <SubmittedConfigDisplay config={form.submittedConfig} />}
      </form>
    </div>
  );
};

export default ModelsFormContent;
