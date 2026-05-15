import { Link } from "react-router-dom";
import hero from "../assets/hero.png";
import Navbar from "../components/Navbar";
import BeforeAfterGallery from "../components/BeforeAfterGallery";

function Home() {
  const services = [
    {
      title: "High Pressure Jet Wash",
      path: "/jet-wash",
      text: "Driveways, patios, walls, entrances and external surfaces cleaned professionally.",
    },
    {
      title: "Garden Maintenance",
      path: "/garden-maintenance",
      text: "Regular garden care, trimming, clearing, lawn care and outdoor maintenance.",
    },
    {
      title: "Property Maintenance",
      path: "/property-maintenance",
      text: "General repairs, upkeep, minor fixes and property support for homes and businesses.",
    },
    {
      title: "Building Management Support",
      path: "/building-management",
      text: "Support for landlords, agencies, communal areas and managed buildings.",
    },
  ];

  return (
    <div style={page}>
      <Navbar />

      <section style={heroSection}>
        <div style={heroText}>
          <p style={tagline}>Property Care & Outdoor Maintenance in London</p>

          <h1 style={heroTitle}>
            Professional maintenance for homes, gardens and buildings.
          </h1>

          <p style={heroSubtitle}>
            Reliable jet washing, garden maintenance, property maintenance and
            building management support across London.
          </p>

          <a href="#services" style={primaryButton}>
            Get a Free Quote
          </a>
        </div>

        <div style={heroImageBox}>
          <img src={hero} alt="Environ Facilities" style={heroImage} />
        </div>
      </section>

      <section id="services" style={servicesSection}>
        <h2 style={sectionTitle}>Our Core Services</h2>

        <div style={servicesGrid}>
          {services.map((service) => (
            <Link key={service.title} to={service.path} style={serviceCard}>
              <span>{service.title}</span>
              <p style={serviceText}>{service.text}</p>
              <small style={cardSmall}>Request quote →</small>
            </Link>
          ))}
        </div>
      </section>

      <BeforeAfterGallery />

      <section style={aboutSection}>
        <div style={aboutBox}>
          <h2 style={sectionTitle}>About Environ Facilities</h2>

          <p style={aboutText}>
            Environ Facilities provides reliable outdoor and property maintenance
            services across London. We focus on high pressure jet washing, garden
            maintenance, property maintenance and building management support.
          </p>

          <p style={aboutText}>
            Our aim is to make property care simple, professional and easy to
            manage. Customers can request a quote online, send photos of the job,
            and receive a clear response from our team.
          </p>
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
  gap: "30px",
  alignItems: "center",
  maxWidth: "1180px",
  margin: "35px auto 45px",
  padding: "28px 30px",
  backgroundColor: "white",
  borderRadius: "24px",
  boxShadow: "0 12px 35px rgba(15,23,42,0.10)",
};

const heroText = {
  textAlign: "center",
  padding: "25px",
};

const tagline = {
  color: "#00BCD4",
  fontWeight: "bold",
  marginBottom: "14px",
  fontSize: "15px",
};

const heroTitle = {
  fontSize: "34px",
  lineHeight: "1.2",
  margin: "0 0 18px",
  color: "#111827",
};

const heroSubtitle = {
  fontSize: "16px",
  color: "#64748b",
  lineHeight: "1.6",
  margin: "0 auto 24px",
  maxWidth: "460px",
};

const primaryButton = {
  display: "inline-block",
  padding: "14px 24px",
  borderRadius: "12px",
  backgroundColor: "#00BCD4",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "15px",
};

const heroImageBox = {
  borderRadius: "20px",
  overflow: "hidden",
};

const heroImage = {
  width: "100%",
  height: "300px",
  objectFit: "cover",
  display: "block",
};

const servicesSection = {
  padding: "55px 20px",
  backgroundColor: "white",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "32px",
  margin: "0 0 32px",
};

const servicesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "18px",
  maxWidth: "1050px",
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
  gap: "10px",
  border: "1px solid #dce6ef",
  textAlign: "center",
};

const serviceText = {
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.5",
  fontWeight: "normal",
  margin: "4px 0",
};

const cardSmall = {
  color: "#00BCD4",
  fontSize: "15px",
};

const aboutSection = {
  padding: "55px 20px",
  backgroundColor: "#f5f7fb",
};

const aboutBox = {
  maxWidth: "850px",
  margin: "0 auto",
  backgroundColor: "white",
  padding: "34px",
  borderRadius: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  textAlign: "center",
};

const aboutText = {
  color: "#5b6b84",
  fontSize: "17px",
  lineHeight: "1.7",
  margin: "14px 0",
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