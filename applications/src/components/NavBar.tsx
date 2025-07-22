import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `btn btn-ghost btn-sm ${isActive ? 'btn-active' : ''}`;

  return (
    <nav className="bg-base-200 shadow px-4 py-2 flex space-x-2">
      <NavLink to="/" className={linkClass} end>
        Home
      </NavLink>
      <NavLink to="/admin/dashboard" className={linkClass}>
        Admin Dashboard
      </NavLink>
      <NavLink to="/admin/apply-leave" className={linkClass}>
        Apply Leave
      </NavLink>
      <NavLink to="/medical" className={linkClass}>
        Medical Dashboard
      </NavLink>
      <NavLink to="/medical-system" className={linkClass}>
        Medical System
      </NavLink>
    </nav>
  );
};

export default Navbar;
