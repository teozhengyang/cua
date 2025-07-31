import ChatBot from './components/chat/ChatBot';
import ModelsForm from './components/models-form/ModelsForm';

function App() {

  return (
    <div className="min-h-screen bg-base-100 p-8 flex gap-4">
      <div className="w-1/3 overflow-auto  p-4 bg-base-200 rounded-lg shadow flex flex-col">
        <ModelsForm />
      </div>

      <div className="flex-1 overflow-auto bg-base-100 rounded-lg shadow flex flex-col">
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
