import Sidebar from '../../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="min-h-screen flex flex-col">
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1 px-4 font-bold text-lg">Admin Portal</div>
      <div className="flex-none">
        <button className="btn btn-sm btn-outline">Logout</button>
      </div>
    </div>

    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet /> 
      </div>
    </div>
  </div>
);

export default AdminLayout;
