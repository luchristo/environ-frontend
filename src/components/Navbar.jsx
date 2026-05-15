import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import hero from "../assets/hero.png";

function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header style={isMobile ? mobileHeader : header}>
      <div style={isMobile ? mobileLeftSide : leftSide}>
        <img src={hero} alt="Environ Facilities" style={isMobile ? mobileLogoImage : logoImage} />

        <div style={isMobile ? mobileTextBox : {}}>
          <h1 style={isMobile ? mobileLogo : logo}>ENVIRON FACILITIES</h1>

          <div style={isMobile ? mobileContactRow : contactRow}>
            <span>+44 7404 536265</span>
            {!isMobile && <span>|</span>}
            <span>environfacilities@gmail.com</span>
          </div>
        </div>
      </div>

      <Link to="/login" style={isMobile ? mobileLoginButton : loginButton}>
        Login
      </Link>
    </header>
  );
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 38px",
  backgroundColor: "white",
  borderBottom: "1px solid #e2e8f0",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const mobileHeader = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "14px",
  padding: "18px 14px",
  backgroundColor: "white",
  borderBottom: "1px solid #e2e8f0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  textAlign: "center",
};

const leftSide = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const mobileLeftSide = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  width: "100%",
};

const logoImage = {
  width: "82px",
  height: "82px",
  objectFit: "contain",
};

const mobileLogoImage = {
  width: "74px",
  height: "74px",
  objectFit: "contain",
};

const logo = {
  fontSize: "32px",
  fontWeight: "800",
  margin: 0,
  color: "#0f172a",
  letterSpacing: "-1px",
};

const mobileLogo = {
  fontSize: "23px",
  fontWeight: "800",
  margin: 0,
  color: "#0f172a",
  letterSpacing: "-0.5px",
};

const mobileTextBox = {
  width: "100%",
};

const contactRow = {
  display: "flex",
  gap: "14px",
  marginTop: "6px",
  color: "#64748b",
  fontSize: "15px",
};

const mobileContactRow = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  marginTop: "6px",
  color: "#64748b",
  fontSize: "13px",
  wordBreak: "break-word",
};

const loginButton = {
  backgroundColor: "#06b6d4",
  color: "white",
  textDecoration: "none",
  padding: "14px 26px",
  borderRadius: "14px",
  fontWeight: "700",
  fontSize: "18px",
};

const mobileLoginButton = {
  backgroundColor: "#06b6d4",
  color: "white",
  textDecoration: "none",
  padding: "11px 22px",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "15px",
};

export default Navbar;