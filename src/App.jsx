import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Logout from "./pages/Logout.jsx";

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

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* SERVICES */}
        <Route path="/domestic-cleaning" element={<DomesticCleaning />} />
        <Route path="/commercial-cleaning" element={<CommercialCleaning />} />
        <Route
          path="/end-of-tenancy-cleaning"
          element={<EndOfTenancyCleaning />}
        />
        <Route path="/carpet-cleaning" element={<CarpetCleaning />} />
        <Route path="/window-cleaning" element={<WindowCleaning />} />
        <Route path="/jet-wash" element={<JetWash />} />
        <Route
          path="/garden-maintenance"
          element={<GardenMaintenance />}
        />
        <Route
          path="/property-maintenance"
          element={<PropertyMaintenance />}
        />
        <Route
          path="/building-management"
          element={<BuildingManagement />}
        />
        <Route
          path="/cleaning-operatives"
          element={<Operatives />}
        />

        {/* CUSTOMER */}
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/logout" element={<Logout />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;