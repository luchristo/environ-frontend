import { useState } from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero.png";
import ReviewForm from "../components/ReviewForm";
import Navbar from "../components/Navbar";

function Home() {
  const [showServices, setShowServices] = useState(false);

  const services = [
    { title: "Domestic Cleaning", path: "/domestic-cleaning" },
    { title: "Commercial Cleaning", path: "/commercial-cleaning" },
    { title: "End of Tenancy Cleaning", path: "/end-of-tenancy-cleaning" },
    { title: "Carpet Cleaning", path: "/carpet-cleaning" },
    { title: "Window Cleaning", path: "/window-cleaning" },
    { title: "High Pressure Jet Wash", path: "/jet-wash" },
    { title: "Garden Maintenance", path: "/garden-maintenance" },
    { title: "Property Maintenance", path: "/property-maintenance" },
    { title: "Building Management Support", path: "/building-management" },
    { title: "Professional Cleaning Operatives", path: "/cleaning-operatives" },
  ];

  return (
    <div style={page}>
      <Navbar />

      <img src={hero} alt="Environ Facilities" style={heroImage} />

      <section style={heroSection}>
        <h1 style={heroTitle}>Professional Cleaning & Property Services</h1>

        <p style={heroSubtitle}>
          Simple, reliable facilities services across London.
        </p>

        <button style={heroButton} onClick={() => setShowServices(true)}>
          Check availability
        </button>
      </section>

      {showServices && (
        <section style={servicesSection}>
          <h2 style={sectionTitle}>What do you need help with?</h2>

          <div style={servicesGrid}>
            {services.map((service) => (
              <Link key={service.title} to={service.path} style={serviceCard}>
                {service.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <ReviewForm />

      <a
        href="https://wa.me/447404536265"
        target="_blank"
        rel="noreferrer"
        style={whatsappButton}
      >
        WhatsApp Us
      </a>
    </div>
  );
}

const page = {
  backgroundColor: "#f5f7fb",
  minHeight: "100vh",
  fontFamily: "Arial",
  color: "#1c2b44",
};

const heroImage = {
  width: "100%",
  maxHeight: "360px",
  objectFit: "cover",
};

const heroSection = {
  textAlign: "center",
  padding: "55px 20px",
  backgroundColor: "white",
};

const heroTitle = {
  fontSize: "42px",
  lineHeight: "1.15",
  maxWidth: "900px",
  margin: "0 auto 16px",
};

const heroSubtitle = {
  fontSize: "21px",
  color: "#5b6b84",
  marginBottom: "32px",
};

const heroButton = {
  padding: "16px 38px",
  fontSize: "18px",
  borderRadius: "14px",
  border: "none",
  backgroundColor: "#9C27B0",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const servicesSection = {
  padding: "60px 20px",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "34px",
  marginBottom: "35px",
};

const servicesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "18px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const serviceCard = {
  backgroundColor: "white",
  padding: "28px 18px",
  borderRadius: "18px",
  textAlign: "center",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1c2b44",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const whatsappButton = {
  position: "fixed",
  right: "20px",
  bottom: "20px",
  backgroundColor: "#25D366",
  color: "white",
  padding: "14px 22px",
  borderRadius: "50px",
  fontWeight: "bold",
  fontSize: "18px",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

export default Home;