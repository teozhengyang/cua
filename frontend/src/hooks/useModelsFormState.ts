import { useEffect, useState } from "react";
import { handleModelSubmit } from "../services/ModelsFormService";
import type { ModelFormConfig } from "../types/ModelsFormType";

export const useModelsFormState = (onSubmit?: (config: ModelFormConfig) => void) => {
  const [modelType, setModelType] = useState("Unified");
  const [plannerModel, setPlannerModel] = useState("GPT");
  const [actorModel, setActorModel] = useState("ShowUI");
  const [qwenDeploymentType, setQwenDeploymentType] = useState<'local' | 'api-based'>('local');
  
  // Unified model fields
  const [claudeApiKey, setClaudeApiKey] = useState("");
  
  // Planner + Actor fields
  const [plannerApiKey, setPlannerApiKey] = useState("");
  const [plannerFolderPath, setPlannerFolderPath] = useState("");
  const [actorFolderPath, setActorFolderPath] = useState("");
  const [actorServerUrl, setActorServerUrl] = useState("");
  
  const [submittedConfig, setSubmittedConfig] = useState<ModelFormConfig | null>(null);

  useEffect(() => {
    if (modelType === "Unified") {
      // Reset planner + actor fields when switching to unified
      setPlannerModel("GPT");
      setActorModel("ShowUI");
      setPlannerApiKey("");
      setPlannerFolderPath("");
      setActorFolderPath("");
      setActorServerUrl("");
    } else {
      // Reset unified fields when switching to planner + actor
      setClaudeApiKey("");
    }
  }, [modelType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config: ModelFormConfig = {
      modelType,
      ...(modelType === "Unified" 
        ? { claudeApiKey }
        : {
            plannerModel,
            plannerApiKey: plannerModel === "GPT" ? plannerApiKey : undefined,
            plannerFolderPath: plannerModel === "Qwen" ? plannerFolderPath : undefined,
            qwenDeploymentType: plannerModel === "Qwen" ? qwenDeploymentType : undefined,
            actorModel,
            actorFolderPath: actorModel === "ShowUI" ? actorFolderPath : undefined,
            actorServerUrl: actorModel === "UI-TARS" ? actorServerUrl : undefined,
          }
      )
    };

    try {
      await handleModelSubmit(config);
    } catch (error) {
      console.error("Error submitting model configuration:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
      return;
     }
    setSubmittedConfig(config);
    if (onSubmit) onSubmit(config);
  };

  const handleClear = () => {
    setModelType("Unified");
    setPlannerModel("GPT");
    setActorModel("ShowUI");
    setQwenDeploymentType('local');
    setClaudeApiKey("");
    setPlannerApiKey("");
    setPlannerFolderPath("");
    setActorFolderPath("");
    setActorServerUrl("");
    setSubmittedConfig(null);
  };

  return {
    modelType,
    plannerModel,
    actorModel,
    qwenDeploymentType,
    claudeApiKey,
    plannerApiKey,
    plannerFolderPath,
    actorFolderPath,
    actorServerUrl,
    submittedConfig,
    setModelType,
    setPlannerModel,
    setActorModel,
    setQwenDeploymentType,
    setClaudeApiKey,
    setPlannerApiKey,
    setPlannerFolderPath,
    setActorFolderPath,
    setActorServerUrl,
    handleSubmit,
    handleClear,
  };
};
