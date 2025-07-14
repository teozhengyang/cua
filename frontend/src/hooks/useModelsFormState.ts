import { useEffect, useState } from "react";
import { handleModelSubmit } from "../services/ModelsFormService";
import type { ModelFormConfig } from "../types/ModelsFormType";

export const useModelsFormState = (onSubmit?: (config: ModelFormConfig) => void) => {
  const [modelType, setModelType] = useState("unified");
  const [plannerModel, setPlannerModel] = useState("claude");
  const [actorModel, setActorModel] = useState("claude");
  const [plannerApiKey, setPlannerApiKey] = useState("");
  const [actorApiKey, setActorApiKey] = useState("");
  const [submittedConfig, setSubmittedConfig] = useState<ModelFormConfig | null>(null);

  useEffect(() => {
    if (modelType === "unified") {
      setPlannerModel("claude");
      setActorModel("claude");
    } else {
      setPlannerModel("gpt");
      setActorModel("showUI");
    }
  }, [modelType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: ModelFormConfig = {
      modelType,
      plannerModel,
      actorModel,
      plannerApiKey,
      actorApiKey: modelType === "unified" ? plannerApiKey : actorApiKey,
    };

    handleModelSubmit(config);
    setSubmittedConfig(config);
    if (onSubmit) onSubmit(config);
  };

  const handleClear = () => {
    setModelType("unified");
    setPlannerModel("claude");
    setActorModel("claude");
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
