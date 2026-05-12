import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import DomesticCleaning from "./pages/DomesticCleaning.jsx";
import CommercialCleaning from "./pages/CommercialCleaning.jsx";
import EndOfTenancyCleaning from "./pages/EndOfTenancyCleaning.jsx";
import CarpetCleaning from "./pages/CarpetCleaning.jsx";
import WindowCleaning from "./pages/WindowCleaning.jsx";
import JetWash from "./pages/JetWash.jsx";
import GardenMaintenance from "./pages/GardenMaintenance.jsx";
import PropertyMaintenance from "./pages/PropertyMaintenance.jsx";
import BuildingManagement from "./pages/BuildingManagement.jsx";
import Operatives from "./pages/Operatives.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

import CustomerSignup from "./pages/CustomerSignup.jsx";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/domestic-cleaning" element={<DomesticCleaning />} />
        <Route path="/commercial-cleaning" element={<CommercialCleaning />} />
        <Route path="/end-of-tenancy-cleaning" element={<EndOfTenancyCleaning />} />
        <Route path="/carpet-cleaning" element={<CarpetCleaning />} />
        <Route path="/window-cleaning" element={<WindowCleaning />} />
        <Route path="/jet-wash" element={<JetWash />} />
        <Route path="/garden-maintenance" element={<GardenMaintenance />} />
        <Route path="/property-maintenance" element={<PropertyMaintenance />} />
        <Route path="/building-management" element={<BuildingManagement />} />
        <Route path="/cleaning-operatives" element={<Operatives />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;