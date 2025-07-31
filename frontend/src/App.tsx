import { useState } from 'react';
import ChatBot from './components/chat/ChatBot';
import ModelsForm from './components/models-form/ModelsForm';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex h-screen">
          {/* Models Configuration Panel - conditionally rendered */}
          {isPanelVisible && (
            <div className="w-1/4 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-hidden">
              <ErrorBoundary fallback={
                <div className="p-4 text-center text-red-600">
                  <p>Configuration panel failed to load</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Reload
                  </button>
                </div>
              }>
                <ModelsForm onClose={togglePanel} />
              </ErrorBoundary>
            </div>
          )}

          {/* Chat Panel - takes full width when config panel is hidden */}
          <div className={`${isPanelVisible ? 'flex-1' : 'w-full'} bg-white dark:bg-slate-800 overflow-hidden relative`}>
            {/* Hover area to reveal button when panel is hidden */}
            {!isPanelVisible && (
              <div className="absolute top-0 left-0 w-12 h-full z-10 group">
                <button
                  onClick={togglePanel}
                  className="absolute top-1/2 -translate-y-1/2 left-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Show configuration panel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            
            <ErrorBoundary fallback={
              <div className="h-full flex items-center justify-center text-red-600">
                <div className="text-center">
                  <p>Chat interface failed to load</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Reload
                  </button>
                </div>
              </div>
            }>
              <ChatBot />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
