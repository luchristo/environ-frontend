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

  return (
    <div style={nav}>
      <div style={contact}>
        <a href="tel:+447404536265" style={link}>
          📞 +44 7404 536265
        </a>

        <a href="mailto:environfacilities@gmail.com" style={link}>
          ✉️ environfacilities@gmail.com
        </a>
      </div>

      {user ? (
        <Link to="/customer-dashboard" style={accountButton}>
          My Account
        </Link>
      ) : (
        <Link to="/login" style={loginButton}>
          Login
        </Link>
      )}
    </div>
  );
}

const nav = {
  backgroundColor: "#111",
  padding: "12px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
};

const contact = {
  display: "flex",
  gap: "22px",
  flexWrap: "wrap",
};

const link = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "15px",
};

const loginButton = {
  backgroundColor: "#00BCD4",
  color: "white",
  textDecoration: "none",
  padding: "8px 18px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "14px",
};

const accountButton = {
  backgroundColor: "#9C27B0",
  color: "white",
  textDecoration: "none",
  padding: "8px 18px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "14px",
};

export default Navbar;