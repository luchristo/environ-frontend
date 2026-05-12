import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

function CustomerSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",
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

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          postcode: formData.postcode,
          role: "customer",
        },
      ]);

      if (profileError) {
        setMessage("Account created, but profile was not saved.");
        setLoading(false);
        return;
      }
    }

    setMessage("Account created successfully.");

    setTimeout(() => {
      navigate("/customer-dashboard");
    }, 1500);

    setLoading(false);
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={signup}>
        <h1 style={title}>Create Account</h1>

        <input
          type="text"
          name="full_name"
          placeholder="Full name"
          required
          value={formData.full_name}
          onChange={handleChange}
          style={input}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone number"
          required
          value={formData.phone}
          onChange={handleChange}
          style={input}
        />

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
          type="text"
          name="address"
          placeholder="Address"
          required
          value={formData.address}
          onChange={handleChange}
          style={input}
        />

        <input
          type="text"
          name="postcode"
          placeholder="Postcode"
          required
          value={formData.postcode}
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

        <button type="submit" style={button} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {message && <p style={messageStyle}>{message}</p>}

        <p style={bottomText}>
          Already have an account? <Link to="/login">Login</Link>
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
  color: "#00BCD4",
  fontWeight: "bold",
};

const bottomText = {
  textAlign: "center",
};

export default CustomerSignup;