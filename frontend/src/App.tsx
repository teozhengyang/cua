import ChatBot from './components/chat/ChatBot';
import ModelsForm from './components/models-form/ModelsForm';

function App() {

  return (
    <div className="min-h-screen bg-base-100 p-8 flex flex-col">
      <div className="resize-y overflow-auto min-h-[200px] max-h-[70vh] p-4 bg-base-200 rounded-lg shadow mb-4">
        <ModelsForm />
      </div>

      <div className="flex-1 overflow-auto bg-base-100 rounded-lg shadow">
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
