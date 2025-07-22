import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 bg-base-200 p-4">
      <ul className="menu rounded-box space-y-1">
        <li><NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li><NavLink to="/admin/apply-leave" className={({ isActive }) => isActive ? 'active' : ''}>Apply Leave</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
