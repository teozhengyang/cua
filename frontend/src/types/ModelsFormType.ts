export interface ModelFormConfig {
  modelType: string;
  plannerModel: string;
  actorModel: string;
  plannerApiKey: string;
  actorApiKey: string;
}

export interface ModelsFormProps {
  onSubmit?: (config: ModelFormConfig) => void;
}

export interface ModelSelectionSectionProps {
  modelType: string;
  plannerModel: string;
  actorModel: string;
  setModelType: (value: string) => void;
  setPlannerModel: (value: string) => void;
  setActorModel: (value: string) => void;
}

export interface ApiKeySectionProps {
  modelType: string;
  plannerApiKey: string;
  actorApiKey: string;
  setPlannerApiKey: (key: string) => void;
  setActorApiKey: (key: string) => void;
}

export interface FormActionButtonsProps {
  handleClear: () => void;
  submittedConfig: boolean;
}

export interface SubmittedConfigProps {
  config: {
    modelType: string;
    plannerModel: string;
    actorModel: string;
    plannerApiKey?: string;
    actorApiKey?: string;
  };
}