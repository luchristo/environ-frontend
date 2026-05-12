import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    const user = session.user;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        email: data.email || user.email || "",
        address: data.address || "",
        postcode: data.postcode || "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    const user = session.user;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        postcode: formData.postcode,
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      navigate("/customer-dashboard");
    }, 1000);

    setLoading(false);
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={saveProfile}>
        <h1 style={title}>Edit Details</h1>

        <input
          name="full_name"
          placeholder="Full name"
          value={formData.full_name}
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="postcode"
          placeholder="Postcode"
          value={formData.postcode}
          onChange={handleChange}
          required
          style={input}
        />

        <button type="submit" style={button} disabled={loading}>
          {loading ? "Saving..." : "Save Details"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/customer-dashboard")}
          style={backButton}
        >
          Back to Dashboard
        </button>

        {message && <p style={messageStyle}>{message}</p>}
      </form>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "Arial",
};

const card = {
  width: "100%",
  maxWidth: "460px",
  backgroundColor: "white",
  padding: "38px",
  borderRadius: "20px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const title = {
  textAlign: "center",
  color: "#1c2b44",
  marginBottom: "10px",
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

const backButton = {
  padding: "14px",
  backgroundColor: "#111",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};

const messageStyle = {
  textAlign: "center",
  color: "#00BCD4",
  fontWeight: "bold",
};

export default EditProfile;