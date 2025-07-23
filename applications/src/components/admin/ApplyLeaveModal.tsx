import React from 'react';
import { toast } from 'react-hot-toast';

interface ApplyLeaveModalProps {
  onClose: () => void;
}

const ApplyLeaveModal = ({ onClose }: ApplyLeaveModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.custom((t) => (
      <div className="bg-base-100 text-base-content px-4 py-3 rounded shadow-lg border border-base-300 flex items-center justify-between gap-4 max-w-sm w-full">
        <div>
          <strong className="block text-base font-semibold">Leave Submitted</strong>
          <span className="text-sm">Your leave request has been submitted successfully.</span>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="btn btn-sm btn-error text-white"
        >
          Dismiss
        </button>
      </div>
    ), { duration: Infinity });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-100 text-base-content rounded-xl w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute top-3 right-3 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Leave Type</label>
            <select className="select select-bordered w-full" required>
              <option value="">Select</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Start Date</label>
            <input type="date" className="input input-bordered w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">End Date</label>
            <input type="date" className="input input-bordered w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
