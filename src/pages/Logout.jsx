import { useEffect } from "react";
import { supabase } from "../lib/supabase";

function Logout() {
  useEffect(() => {
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

    logout();
  }, []);

  return <div style={{ padding: "40px" }}>Logging out...</div>;
}

export default Logout;