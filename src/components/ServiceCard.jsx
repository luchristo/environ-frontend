import { Link } from "react-router-dom";

function ServiceCard({ title, link }) {
  return (
    <Link to={link} style={card}>
      {title}
    </Link>
  );
}

const card = {
  backgroundColor: "white",
  color: "#1c2b44",
  textDecoration: "none",
  minHeight: "120px",
  borderRadius: "22px",
  border: "1px solid #d5deea",
  boxShadow: "0 5px 12px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "bold",
  padding: "25px",
};

export default ServiceCard;