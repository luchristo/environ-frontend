import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import hero from "../assets/hero.png";
import Navbar from "../components/Navbar";
import BeforeAfterGallery from "../components/BeforeAfterGallery";



function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      <section style={isMobile ? mobileHeroSection : heroSection}>
        <div style={isMobile ? mobileHeroText : heroText}>
          <p style={tagline}>Property Care & Outdoor Maintenance in London</p>

          <h1 style={isMobile ? mobileHeroTitle : heroTitle}>
            Professional maintenance for homes, gardens and buildings.
          </h1>

          <p style={isMobile ? mobileHeroSubtitle : heroSubtitle}>
            Reliable jet washing, garden maintenance, property maintenance and
            building management support across London.
          </p>

          <a href="#services" style={primaryButton}>
            Get a Free Quote
          </a>
        </div>

        <div style={heroImageBox}>
          <img src={hero} alt="Environ Facilities" style={isMobile ? mobileHeroImage : heroImage} />
        </div>
      </section>

      <section id="services" style={servicesSection}>
        <h2 style={isMobile ? mobileSectionTitle : sectionTitle}>Our Core Services</h2>

        <div style={isMobile ? mobileServicesGrid : servicesGrid}>
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
        <div style={isMobile ? mobileAboutBox : aboutBox}>
          <h2 style={isMobile ? mobileSectionTitle : sectionTitle}>
            About Environ Facilities
          </h2>

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
  <div style={footerLinks}>
    <Link to="/privacy-policy" style={footerLink}>
      Privacy Policy
    </Link>
    <Link to="/terms-and-conditions" style={footerLink}>
      Terms & Conditions
    </Link>
    <Link to="/cookie-policy" style={footerLink}>
      Cookie Policy
    </Link>
  </div>
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

const mobileHeroSection = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  margin: "18px 14px 28px",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const heroText = {
  textAlign: "center",
  padding: "25px",
};

const mobileHeroText = {
  textAlign: "center",
  padding: "8px",
};

const tagline = {
  color: "#00BCD4",
  fontWeight: "bold",
  marginBottom: "12px",
  fontSize: "14px",
};

const heroTitle = {
  fontSize: "34px",
  lineHeight: "1.2",
  margin: "0 0 18px",
  color: "#111827",
};

const mobileHeroTitle = {
  fontSize: "25px",
  lineHeight: "1.2",
  margin: "0 0 14px",
  color: "#111827",
};

const heroSubtitle = {
  fontSize: "16px",
  color: "#64748b",
  lineHeight: "1.6",
  margin: "0 auto 24px",
  maxWidth: "460px",
};

const mobileHeroSubtitle = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
  margin: "0 auto 20px",
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
  borderRadius: "18px",
  overflow: "hidden",
};

const heroImage = {
  width: "100%",
  height: "300px",
  objectFit: "cover",
  display: "block",
};

const mobileHeroImage = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  display: "block",
};

const servicesSection = {
  padding: "45px 16px",
  backgroundColor: "white",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "32px",
  margin: "0 0 32px",
};

const mobileSectionTitle = {
  textAlign: "center",
  fontSize: "25px",
  margin: "0 0 24px",
};

const servicesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "18px",
  maxWidth: "1050px",
  margin: "0 auto",
};

const mobileServicesGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "14px",
  maxWidth: "100%",
  margin: "0 auto",
};

const serviceCard = {
  backgroundColor: "#f5f7fb",
  padding: "22px",
  borderRadius: "18px",
  color: "#1c2b44",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "17px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  border: "1px solid #dce6ef",
  textAlign: "center",
};

const serviceText = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.5",
  fontWeight: "normal",
  margin: "4px 0",
};

const cardSmall = {
  color: "#00BCD4",
  fontSize: "15px",
};

const aboutSection = {
  padding: "45px 16px",
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

const mobileAboutBox = {
  backgroundColor: "white",
  padding: "24px 18px",
  borderRadius: "18px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  textAlign: "center",
};

const aboutText = {
  color: "#5b6b84",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "14px 0",
};

const footer = {
  textAlign: "center",
  padding: "24px 20px",
  backgroundColor: "#1c2b44",
  color: "white",
};

const footerLinks = {
  marginTop: "12px",
  display: "flex",
  justifyContent: "center",
  gap: "18px",
  flexWrap: "wrap",
};

const footerLink = {
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: "14px",
};

const whatsappButton = {
  position: "fixed",
  right: "14px",
  bottom: "14px",
  backgroundColor: "#25D366",
  color: "white",
  padding: "11px 16px",
  borderRadius: "40px",
  fontWeight: "bold",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
  fontSize: "14px",
};

export default Home;