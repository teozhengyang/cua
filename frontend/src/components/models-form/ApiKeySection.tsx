import type { ApiKeySectionProps } from "../../types/ModelsFormType";

const ApiKeySection = ({
  modelType,
  plannerModel,
  actorModel,
  qwenDeploymentType,
  claudeApiKey,
  plannerApiKey,
  plannerFolderPath,
  actorFolderPath,
  actorServerUrl,
  setClaudeApiKey,
  setPlannerApiKey,
  setPlannerFolderPath,
  setActorFolderPath,
  setActorServerUrl
}: ApiKeySectionProps) => {
  
  const handleFolderSelection = async (setterFunction: (path: string) => void) => {
    try {
      // Use the File System Access API if available (modern browsers)
      if ('showDirectoryPicker' in window) {
        interface DirectoryHandle {
          name: string;
        }
        const directoryHandle = await (window as typeof window & { 
          showDirectoryPicker: () => Promise<DirectoryHandle> 
        }).showDirectoryPicker();
        setterFunction(directoryHandle.name);
      } else {
        // Fallback: create a file input for folder selection
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.addEventListener('change', (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            // Extract the folder path from the first file
            const fullPath = files[0].webkitRelativePath;
            const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
            setterFunction(folderPath || files[0].name);
          }
        });
        input.click();
      }
    } catch (error) {
      console.log('User cancelled folder selection or error occurred:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Unified Model Configuration */}
      {modelType === "Unified" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Claude API Key
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter Claude API key"
            value={claudeApiKey}
            onChange={(e) => setClaudeApiKey(e.target.value)}
          />
        </div>
      )}

      {/* Planner + Actor Configuration */}
      {modelType === "Planner + Actor" && (
        <div className="space-y-6">
          {/* Planner Configuration */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <h4 className="text-base font-medium mb-4 text-slate-800 dark:text-slate-200">
              Planner Configuration
            </h4>
            {plannerModel === "GPT" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GPT API Key</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter GPT API key"
                  value={plannerApiKey}
                  onChange={(e) => setPlannerApiKey(e.target.value)}
                />
              </div>
            )}
            {plannerModel === "Qwen" && qwenDeploymentType === "local" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Qwen Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter Qwen folder path"
                    value={plannerFolderPath}
                    onChange={(e) => setPlannerFolderPath(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => handleFolderSelection(setPlannerFolderPath)}
                  >
                    Browse
                  </button>
                </div>
              </div>
            )}
            {plannerModel === "Qwen" && qwenDeploymentType === "api-based" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Qwen API Key</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter Qwen API key"
                  value={plannerApiKey}
                  onChange={(e) => setPlannerApiKey(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Actor Configuration */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <h4 className="text-base font-medium mb-4 text-slate-800 dark:text-slate-200">
              Actor Configuration
            </h4>
            {actorModel === "ShowUI" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ShowUI Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter ShowUI folder path"
                    value={actorFolderPath}
                    onChange={(e) => setActorFolderPath(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={() => handleFolderSelection(setActorFolderPath)}
                  >
                    Browse
                  </button>
                </div>
              </div>
            )}
            {actorModel === "UI-TARS" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">UI-TARS Server URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter UI-TARS server URL"
                  value={actorServerUrl}
                  onChange={(e) => setActorServerUrl(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiKeySection;
