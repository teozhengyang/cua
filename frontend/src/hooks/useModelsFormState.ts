import { useEffect, useState, useCallback, useMemo } from "react";
import { handleModelSubmit } from "../services/ModelsFormService";
import type { ModelFormConfig } from "../types/ModelsFormType";
import { validateModelConfig } from "../utils";

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset fields when model type changes
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
    setValidationErrors([]);
  }, [modelType]);

  // Memoized validation check
  const isFormValid = useMemo(() => {
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
    
    const errors = validateModelConfig(config);
    return errors.length === 0;
  }, [
    modelType, claudeApiKey, plannerModel, plannerApiKey, plannerFolderPath,
    qwenDeploymentType, actorModel, actorFolderPath, actorServerUrl
  ]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);

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

    // Validate configuration
    const errors = validateModelConfig(config);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await handleModelSubmit(config);
      setSubmittedConfig(config);
      if (onSubmit) onSubmit(config);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setValidationErrors([errorMessage]);
      console.error("Error submitting model configuration:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    modelType, claudeApiKey, plannerModel, plannerApiKey, plannerFolderPath,
    qwenDeploymentType, actorModel, actorFolderPath, actorServerUrl, onSubmit
  ]);

  const handleClear = useCallback(() => {
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
    setValidationErrors([]);
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    // State
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
    validationErrors,
    isSubmitting,
    isFormValid,
    
    // Setters
    setModelType,
    setPlannerModel,
    setActorModel,
    setQwenDeploymentType,
    setClaudeApiKey,
    setPlannerApiKey,
    setPlannerFolderPath,
    setActorFolderPath,
    setActorServerUrl,
    
    // Actions
    handleSubmit,
    handleClear,
    clearValidationErrors,
  };
};
