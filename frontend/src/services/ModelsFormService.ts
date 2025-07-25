import type { ModelFormConfig } from "../types/ModelsFormType";

export const handleModelSubmit = (config: ModelFormConfig) => {
  console.log("Selected config:", config);

  // send the configuration to the backend to check the API keys
  fetch("http://localhost:8000/health", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },   
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Invalid API key");
    }
    console.log("API keys are valid");
    return response.json();
  })
};