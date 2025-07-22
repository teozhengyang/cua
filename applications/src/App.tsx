import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplyLeave from './pages/admin/ApplyLeave';
import AdminLayout from './pages/admin/AdminLayout';
import MedicalSystem from './pages/medical-system/MedicalSystem';
import MedicalDashboard from "./pages/medical-records/MedicalDashBoard";
import PatientDetails from "./pages/medical-records/PatientDetails";
import Navbar from './components/NavBar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
        </Route>

        <Route path="/medical" element={<MedicalDashboard />} />
        <Route path="/medical/:id" element={<PatientDetails />} />

        <Route path="/medical-system" element={<MedicalSystem />} />
      </Routes>
    </Router>
  );
}

export default App;
