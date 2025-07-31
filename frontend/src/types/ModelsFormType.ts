export interface ModelFormConfig {
  modelType: string;
  // Unified model config
  claudeApiKey?: string;
  // Planner + Actor config
  plannerModel?: string;
  plannerApiKey?: string;
  plannerFolderPath?: string;
  qwenDeploymentType?: 'local' | 'api-based';
  actorModel?: string;
  actorFolderPath?: string;
  actorServerUrl?: string;
}

export interface ModelsFormProps {
  onSubmit?: (config: ModelFormConfig) => void;
}

export interface ModelSelectionSectionProps {
  modelType: string;
  plannerModel: string;
  actorModel: string;
  qwenDeploymentType: 'local' | 'api-based';
  setModelType: (value: string) => void;
  setPlannerModel: (value: string) => void;
  setActorModel: (value: string) => void;
  setQwenDeploymentType: (type: 'local' | 'api-based') => void;
}

export interface ApiKeySectionProps {
  modelType: string;
  plannerModel: string;
  actorModel: string;
  qwenDeploymentType: 'local' | 'api-based';
  claudeApiKey: string;
  plannerApiKey: string;
  plannerFolderPath: string;
  actorFolderPath: string;
  actorServerUrl: string;
  setClaudeApiKey: (key: string) => void;
  setPlannerApiKey: (key: string) => void;
  setPlannerFolderPath: (path: string) => void;
  setActorFolderPath: (path: string) => void;
  setActorServerUrl: (url: string) => void;
}

export interface FormActionButtonsProps {
  handleClear: () => void;
  submittedConfig: boolean;
}

export interface SubmittedConfigProps {
  config: {
    modelType: string;
    claudeApiKey?: string;
    plannerModel?: string;
    plannerApiKey?: string;
    plannerFolderPath?: string;
    qwenDeploymentType?: 'local' | 'api-based';
    actorModel?: string;
    actorFolderPath?: string;
    actorServerUrl?: string;
  };
}