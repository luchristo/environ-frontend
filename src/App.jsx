import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";

const JetWash = lazy(() => import("./pages/JetWash.jsx"));
const GardenMaintenance = lazy(() => import("./pages/GardenMaintenance.jsx"));
const PropertyMaintenance = lazy(() => import("./pages/PropertyMaintenance.jsx"));
const BuildingManagement = lazy(() => import("./pages/BuildingManagement.jsx"));

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const TermsConditions = lazy(() => import("./pages/TermsConditions.jsx"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy.jsx"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));

const CustomerSignup = lazy(() => import("./pages/CustomerSignup.jsx"));
const CustomerLogin = lazy(() => import("./pages/CustomerLogin.jsx"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const Logout = lazy(() => import("./pages/Logout.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p role="status" style={{ padding: "24px" }}>Loading page…</p>}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;