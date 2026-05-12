import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

function CustomerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage("Invalid email or password.");
      setLoading(false);
      return;
    }

    navigate("/customer-dashboard");
    setLoading(false);
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={login}>
        <h1 style={title}>Customer Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          value={formData.email}
          onChange={handleChange}
          style={input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={input}
        />

        <button type="submit" style={button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p style={messageStyle}>{message}</p>}

        <p style={bottomText}>
          No account yet? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f7fb",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const title = {
  textAlign: "center",
  marginBottom: "10px",
  color: "#1c2b44",
};

const input = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #d5deea",
  fontSize: "16px",
};

const button = {
  padding: "16px",
  backgroundColor: "#00BCD4",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
};

const messageStyle = {
  textAlign: "center",
  color: "red",
  fontWeight: "bold",
};

const bottomText = {
  textAlign: "center",
};

export default CustomerLogin;