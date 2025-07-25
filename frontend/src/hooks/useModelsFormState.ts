import { useEffect, useState } from "react";
import { handleModelSubmit } from "../services/ModelsFormService";
import type { ModelFormConfig } from "../types/ModelsFormType";

export const useModelsFormState = (onSubmit?: (config: ModelFormConfig) => void) => {
  const [modelType, setModelType] = useState("Unified");
  const [plannerModel, setPlannerModel] = useState("Claude");
  const [actorModel, setActorModel] = useState("Claude");
  const [plannerApiKey, setPlannerApiKey] = useState("");
  const [actorApiKey, setActorApiKey] = useState("");
  const [submittedConfig, setSubmittedConfig] = useState<ModelFormConfig | null>(null);

  useEffect(() => {
    if (modelType === "Unified") {
      setPlannerModel("Claude");
      setActorModel("Claude");
    } else {
      setPlannerModel("GPT");
      setActorModel("ShowUI");
    }
  }, [modelType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config: ModelFormConfig = {
      modelType,
      plannerModel,
      actorModel,
      plannerApiKey,
      actorApiKey: modelType === "Unified" ? plannerApiKey : actorApiKey,
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
    setPlannerModel("");
    setActorModel("");
    setPlannerApiKey("");
    setActorApiKey("");
    setSubmittedConfig(null);
  };

  return {
    modelType,
    plannerModel,
    actorModel,
    plannerApiKey,
    actorApiKey,
    submittedConfig,
    setModelType,
    setPlannerModel,
    setActorModel,
    setPlannerApiKey,
    setActorApiKey,
    handleSubmit,
    handleClear,
  };
};
