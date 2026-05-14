import { useState } from "react";
import { supabase } from "../lib/supabase";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage("Invalid login details.");
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut({ scope: "global" });

        localStorage.clear();
        sessionStorage.clear();

        setErrorMessage("This account is not an admin.");
        setIsLoading(false);
        return;
      }

      window.location.replace("/admin");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong.");
    }

    setIsLoading(false);
  };

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={form}>
        <h1 style={title}>Admin Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Admin email"
          value={formData.email}
          onChange={handleChange}
          required
          style={input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={input}
        />

        <button type="submit" style={button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {errorMessage && (
          <p style={errorText}>
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f7fb",
};

const form = {
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const title = {
  textAlign: "center",
  color: "#1c2b44",
};

const input = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #d4dde7",
  fontSize: "16px",
};

const button = {
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#00BCD4",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const errorText = {
  color: "red",
  textAlign: "center",
  fontWeight: "bold",
};

export default AdminLogin;