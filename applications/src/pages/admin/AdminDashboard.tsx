const AdminDashboard = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Upcoming Leaves</h3>
          <ul className="list-disc pl-4 text-sm">
            <li>John Tan - Annual Leave (Aug 1 - Aug 3)</li>
            <li>Sarah Lim - Sick Leave (Jul 25)</li>
          </ul>
        </div>

        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Team Stats</h3>
          <p>Total Leave Requests This Month: <strong>12</strong></p>
          <p>Pending Approvals: <strong>3</strong></p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
