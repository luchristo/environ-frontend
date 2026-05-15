import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import hero from "../assets/hero.png";

function Navbar() {

  return (

    <header style={header}>

      <div style={leftSide}>

        <img src={hero} alt="Environ Facilities" style={logoImage} />

        <div>

          <h1 style={logo}>ENVIRON FACILITIES</h1>

          <div style={contactRow}>

            <span>+44 7404 536265</span>

            <span>|</span>

            <span>environfacilities@gmail.com</span>

          </div>

        </div>

      </div>

      <Link to="/admin" style={loginButton}>

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

const leftSide = {

  display: "flex",

  alignItems: "center",

  gap: "18px",

};

const logoImage = {

  width: "82px",

  height: "82px",

  objectFit: "contain",

};

const logo = {

  fontSize: "32px",

  fontWeight: "800",

  margin: 0,

  color: "#0f172a",

  letterSpacing: "-1px",

};

const contactRow = {

  display: "flex",

  gap: "14px",

  marginTop: "6px",

  color: "#64748b",

  fontSize: "15px",

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

export default Navbar;