import { useState } from "react";

const actions = [
  { id: "connect", label: "Connect Patient" },
  { id: "scan", label: "Scan Patient" },
  { id: "analyze", label: "Process Sample" },
  { id: "print", label: "Print Report" },
  { id: "sanitize", label: "Sanitize Equipment" },
  { id: "calibrate", label: "Calibrate Sensors" },
  { id: "shutdown", label: "Emergency Shutdown" },
  { id: "reset", label: "Reset Machine" },
];

const actionMessages: Record<string, string> = {
  connect: "Patient connected. Initializing sensors...",
  scan: "Scanning patient vitals... Heart rate: 76 bpm, Temp: 37.2°C.",
  analyze: "Analyzing blood sample... WBC: Normal, Glucose: Slightly high.",
  print: "Printing report... Sent to connected printer.",
  sanitize: "Sanitizing equipment... Please wait 15 seconds.",
  calibrate: "Calibrating sensors... Sensors aligned successfully.",
  shutdown: "Emergency shutdown initiated. Powering off modules.",
  reset: "System reset. Ready for new patient.",
};

function MedicalSystem() {
  const [log, setLog] = useState<string[]>([]);

  const handleAction = (id: string) => {
    const now = new Date().toLocaleTimeString();
    const message = actionMessages[id];
    const formatted = `[${now}] > ${message}`;
    setLog((prev) => [...prev, formatted]);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Machine</h1>

      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Control Panel</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className={`btn ${
                  action.id === "shutdown"
                    ? "btn-error"
                    : action.id === "reset"
                    ? "btn-accent"
                    : "btn-primary"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="bg-neutral text-green-400 font-mono text-sm p-4 rounded h-64 overflow-y-auto border border-green-600 shadow-inner">
            {log.length === 0 ? (
              <p className="text-gray-400 italic">[Machine idle...]</p>
            ) : (
              log.map((entry, idx) => <p key={idx} className="whitespace-pre-wrap">{entry}</p>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalSystem;
