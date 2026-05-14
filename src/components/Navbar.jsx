import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user || null);
  };

 const logout = async () => {
  await supabase.auth.signOut({ scope: "global" });

  Object.keys(localStorage).forEach((key) => {
    localStorage.removeItem(key);
  });

  Object.keys(sessionStorage).forEach((key) => {
    sessionStorage.removeItem(key);
  });

  window.location.replace("/login");
};

  return (
    <header style={nav}>
      <div style={logoSection}>
        <h2 style={logo}>ENVIRON FACILITIES</h2>

        <div style={contact}>
          <a href="tel:+447404536265" style={link}>
            +44 7404 536265
          </a>

          <span style={divider}>|</span>

          <a href="mailto:environfacilities@gmail.com" style={link}>
            environfacilities@gmail.com
          </a>
        </div>
      </div>

      {user ? (
        <div style={buttonGroup}>
          <Link to="/customer-dashboard" style={accountButton}>
            My Account
          </Link>

          <button
            onClick={logout}
            style={logoutButton}
            >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" style={loginButton}>
          Login
        </Link>
      )}
    </header>
  );
}

const nav = {
  backgroundColor: "#ffffff",
  padding: "18px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logoSection = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const logo = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "800",
  color: "#111827",
  letterSpacing: "1px",
};

const contact = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const link = {
  color: "#4b5563",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "500",
};

const divider = {
  color: "#cbd5e1",
};

const buttonGroup = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const loginButton = {
  backgroundColor: "#06b6d4",
  color: "white",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
};

const accountButton = {
  backgroundColor: "#111827",
  color: "white",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
};

const logoutButton = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
};

export default Navbar;