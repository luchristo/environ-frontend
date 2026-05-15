import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";

import JetWash from "./pages/JetWash.jsx";
import GardenMaintenance from "./pages/GardenMaintenance.jsx";
import PropertyMaintenance from "./pages/PropertyMaintenance.jsx";
import BuildingManagement from "./pages/BuildingManagement.jsx";

import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import CookiePolicy from "./pages/CookiePolicy.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

import CustomerSignup from "./pages/CustomerSignup.jsx";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Logout from "./pages/Logout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* SERVICES */}
        <Route path="/jet-wash" element={<JetWash />} />
        <Route path="/garden-maintenance" element={<GardenMaintenance />} />
        <Route path="/property-maintenance" element={<PropertyMaintenance />} />
        <Route path="/building-management" element={<BuildingManagement />} />

        {/* CUSTOMER */}
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/logout" element={<Logout />} />

        {/* LEGAL */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;