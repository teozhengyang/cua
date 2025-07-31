interface ModelsFormHeaderProps {
  hasSubmittedConfig: boolean;
  onClose?: () => void;
}

const XMarkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ModelsFormHeader = ({ hasSubmittedConfig, onClose }: ModelsFormHeaderProps) => {
  return (
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Models Configuration
          </h2>
          {hasSubmittedConfig && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ Configuration saved
            </p>
          )}
        </div>
        
        {/* Close Panel Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Close configuration panel"
          >
            <XMarkIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default ModelsFormHeader;
