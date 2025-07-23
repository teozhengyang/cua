import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import AdminDashboard from "./pages/admin/AdminDashboard";
import MedicalSystem from './pages/medical-system/MedicalSystem';
import MedicalDashboard from "./pages/medical-records/MedicalDashBoard";
import PatientDetails from "./pages/medical-records/PatientDetails";
import HomePage from "./pages/HomePage";
import Navbar from './components/home-page/NavBar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/medical" element={<MedicalDashboard />} />
        <Route path="/medical/:id" element={<PatientDetails />} />
        <Route path="/medical-system" element={<MedicalSystem />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
