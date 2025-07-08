import ModelForm from "./components/modelsForm/modelsForm";
import Chatbot from "./components/chatbot/chatbot";

const App = () => {
  const handleModelSubmit = (config) => {
    console.log("Selected config:", config);
    // Send config to backend or store in state
  };

  return (
    <div className="min-h-screen bg-base-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ModelForm onSubmit={handleModelSubmit} />
      <Chatbot />
    </div>
  );
};

export default App;
