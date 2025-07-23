import { useState } from 'react';
import ApplyLeaveModal from  '../../components/admin/ApplyLeaveModal';

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md">
        <div className="flex-1 px-4 font-bold text-2xl">Admin Portal</div>
        <div className="flex-none space-x-2">
          <button className="btn btn-sm btn-primary text-lg" onClick={() => setShowModal(true)}>
            Apply Leave
          </button>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-md p-6">
            <h3 className="text-base font-semibold mb-3">Upcoming Leaves</h3>
            <ul className="list-disc pl-5 text-base">
              <li>John Tan - Annual Leave (Aug 1 - Aug 3)</li>
              <li>Sarah Lim - Sick Leave (Jul 25)</li>
            </ul>
          </div>

          <div className="card bg-base-100 shadow-md p-6">
            <h3 className="text-base font-semibold mb-3">Team Stats</h3>
            <p className="text-base">Total Leave Requests This Month: <strong>12</strong></p>
            <p className="text-base">Pending Approvals: <strong>3</strong></p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AdminDashboard;
