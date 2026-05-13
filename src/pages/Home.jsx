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

          <h1 style={heroTitle}>
            Reliable facilities services, with fast quotes and simple booking.
          </h1>

          <p style={heroSubtitle}>
            Choose the service you need, send a request, and we’ll get back to
            you with a quote.
          </p>

          <div style={heroActions}>
            <a href="#services" style={primaryButton}>
              Request a Quote
            </a>

            <a href="https://wa.me/447404536265" style={secondaryButton}>
              WhatsApp Us
            </a>
          </div>
        </div>

        <div style={heroImageBox}>
          <img src={hero} alt="Environ Facilities" style={heroImage} />
        </div>
      </section>

      <section id="services" style={servicesSection}>
        <h2 style={sectionTitle}>Choose a service</h2>
        <p style={sectionSubtitle}>
          Select what you need and complete a short request form.
        </p>

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
        <h2 style={sectionTitle}>Why choose Environ Facilities?</h2>

        <div style={whyGrid}>
          <div style={whyCard}>
            <h3>Fast response</h3>
            <p>Send your request and we’ll respond with a quote as soon as possible.</p>
          </div>

          <div style={whyCard}>
            <h3>London coverage</h3>
            <p>Cleaning, maintenance and facilities support across London.</p>
          </div>

          <div style={whyCard}>
            <h3>Simple process</h3>
            <p>Choose a service, upload photos if needed, and receive a clear quote.</p>
          </div>
        </div>
      </section>

      <footer style={footer}>
        <strong>Environ Facilities</strong>
        <p>📞 +44 7404 536265</p>
        <p>✉️ environfacilities@gmail.com</p>
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
  gap: "30px",
  alignItems: "center",
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "70px 24px",
};

const heroText = {
  backgroundColor: "white",
  padding: "42px",
  borderRadius: "26px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const tagline = {
  color: "#00BCD4",
  fontWeight: "bold",
  marginBottom: "12px",
};

const heroTitle = {
  fontSize: "46px",
  lineHeight: "1.1",
  margin: "0 0 18px",
};

const heroSubtitle = {
  fontSize: "19px",
  color: "#5b6b84",
  lineHeight: "1.6",
  marginBottom: "28px",
};

const heroActions = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
};

const primaryButton = {
  padding: "15px 24px",
  borderRadius: "14px",
  backgroundColor: "#00BCD4",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const secondaryButton = {
  padding: "15px 24px",
  borderRadius: "14px",
  backgroundColor: "#1c2b44",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const heroImageBox = {
  backgroundColor: "white",
  borderRadius: "26px",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const heroImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const servicesSection = {
  padding: "70px 24px",
  backgroundColor: "white",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "36px",
  margin: "0 0 12px",
};

const sectionSubtitle = {
  textAlign: "center",
  color: "#5b6b84",
  fontSize: "18px",
  marginBottom: "34px",
};

const servicesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "16px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const serviceCard = {
  backgroundColor: "#f5f7fb",
  padding: "24px",
  borderRadius: "18px",
  color: "#1c2b44",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  border: "1px solid #dce6ef",
};

const cardSmall = {
  color: "#00BCD4",
};

const whySection = {
  padding: "70px 24px",
};

const whyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  maxWidth: "1000px",
  margin: "34px auto 0",
};

const whyCard = {
  backgroundColor: "white",
  padding: "26px",
  borderRadius: "20px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  lineHeight: "1.6",
};

const footer = {
  textAlign: "center",
  padding: "35px 20px",
  backgroundColor: "#1c2b44",
  color: "white",
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
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

export default Home;