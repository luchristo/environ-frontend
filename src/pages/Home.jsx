import { Link } from "react-router-dom";
import hero from "../assets/hero.png";
import Navbar from "../components/Navbar";

function Home() {
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
    { title: "Cleaning Operatives", path: "/cleaning-operatives" },
  ];

  return (
    <div style={page}>
      <Navbar />

      <section style={heroSection}>
        <div style={heroText}>
          <p style={tagline}>Cleaning & Property Services in London</p>

          <h1 style={heroTitle}>Fast quotes. Reliable service.</h1>

          <p style={heroSubtitle}>
            Choose a service, send your request, and we’ll get back to you with
            a clear quote.
          </p>

          <a href="#services" style={primaryButton}>
            Request a Quote
          </a>
        </div>

        <div style={heroImageBox}>
          <img src={hero} alt="Environ Facilities" style={heroImage} />
        </div>
      </section>

      <section id="services" style={servicesSection}>
        <h2 style={sectionTitle}>Choose a service</h2>

        <div style={servicesGrid}>
          {services.map((service) => (
            <Link key={service.title} to={service.path} style={serviceCard}>
              <span>{service.title}</span>
              <small style={cardSmall}>Get quote →</small>
            </Link>
          ))}
        </div>
      </section>

      <section style={whySection}>
        <h2 style={sectionTitle}>Simple process</h2>

        <div style={whyGrid}>
          <div style={whyCard}>
            <h3>1. Choose service</h3>
            <p>Select the cleaning or property service you need.</p>
          </div>

          <div style={whyCard}>
            <h3>2. Send request</h3>
            <p>Fill in your details and upload photos if needed.</p>
          </div>

          <div style={whyCard}>
            <h3>3. Receive quote</h3>
            <p>We’ll reply with a clear quote as soon as possible.</p>
          </div>
        </div>
      </section>

      <footer style={footer}>
        <strong>© Environ Facilities</strong>
      </footer>

      <a
        href="https://wa.me/447404536265"
        target="_blank"
        rel="noreferrer"
        style={whatsappButton}
      >
        WhatsApp
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

const heroSection = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "22px",
  alignItems: "center",
  maxWidth: "1050px",
  margin: "0 auto",
  padding: "42px 20px",
};

const heroText = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
  textAlign: "center",
};

const tagline = {
  color: "#00BCD4",
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "15px",
};

const heroTitle = {
  fontSize: "34px",
  lineHeight: "1.15",
  margin: "0 0 14px",
};

const heroSubtitle = {
  fontSize: "16px",
  color: "#5b6b84",
  lineHeight: "1.5",
  marginBottom: "22px",
};

const primaryButton = {
  display: "inline-block",
  padding: "13px 22px",
  borderRadius: "12px",
  backgroundColor: "#00BCD4",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "15px",
};

const heroImageBox = {
  backgroundColor: "white",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
};

const heroImage = {
  width: "100%",
  maxHeight: "260px",
  objectFit: "cover",
  display: "block",
};

const servicesSection = {
  padding: "45px 20px",
  backgroundColor: "white",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "28px",
  margin: "0 0 28px",
};

const servicesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  maxWidth: "1000px",
  margin: "0 auto",
};

const serviceCard = {
  backgroundColor: "#f5f7fb",
  padding: "18px",
  borderRadius: "14px",
  color: "#1c2b44",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  border: "1px solid #dce6ef",
  textAlign: "center",
};

const cardSmall = {
  color: "#00BCD4",
};

const whySection = {
  padding: "45px 20px",
};

const whyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  maxWidth: "900px",
  margin: "0 auto",
};

const whyCard = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  lineHeight: "1.5",
  textAlign: "center",
};

const footer = {
  textAlign: "center",
  padding: "24px 20px",
  backgroundColor: "#1c2b44",
  color: "white",
};

const whatsappButton = {
  position: "fixed",
  right: "18px",
  bottom: "18px",
  backgroundColor: "#25D366",
  color: "white",
  padding: "12px 18px",
  borderRadius: "40px",
  fontWeight: "bold",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
  fontSize: "15px",
};

export default Home;