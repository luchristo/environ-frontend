import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/customer-login";
      return;
    }

    setUser(session.user);

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    const { data: invoicesData } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setBookings(bookingsData || []);
    setInvoices(invoicesData || []);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/customer-login";
  };

  return (
    <div style={page}>
      <aside style={sidebar}>
        <div style={logoBox}>
          <div style={logo}>EF</div>

          <div>
            <h2 style={brand}>Environ</h2>
            <p style={brandSub}>Customer Portal</p>
          </div>
        </div>

        <div style={menu}>
          <button
            style={activeTab === "overview" ? activeButton : menuButton}
            onClick={() => setActiveTab("overview")}
          >
            Dashboard
          </button>

          <button
            style={activeTab === "bookings" ? activeButton : menuButton}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>

          <button
            style={activeTab === "invoices" ? activeButton : menuButton}
            onClick={() => setActiveTab("invoices")}
          >
            My Invoices
          </button>

          <button
            style={activeTab === "appointments" ? activeButton : menuButton}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
        </div>

        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </aside>

      <main style={main}>
        <div style={header}>
          <div>
            <h1 style={title}>
              Welcome {user?.email?.split("@")[0]}
            </h1>

            <p style={subtitle}>
              Manage your bookings and invoices.
            </p>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div style={statsGrid}>
              <div style={card}>
                <h3>Total Bookings</h3>
                <strong style={big}>{bookings.length}</strong>
              </div>

              <div style={card}>
                <h3>Invoices</h3>
                <strong style={big}>{invoices.length}</strong>
              </div>

              <div style={card}>
                <h3>Confirmed</h3>
                <strong style={big}>
                  {
                    bookings.filter(
                      (b) => b.status === "confirmed"
                    ).length
                  }
                </strong>
              </div>
            </div>
          </>
        )}

        {activeTab === "bookings" && (
          <div style={section}>
            <h2>My Bookings</h2>

            {bookings.map((booking) => (
              <div key={booking.id} style={itemCard}>
                <h3>{booking.service}</h3>

                <p>{booking.address}</p>

                <span style={status}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "invoices" && (
          <div style={section}>
            <h2>My Invoices</h2>

            {invoices.map((invoice) => (
              <div key={invoice.id} style={itemCard}>
                <h3>{invoice.service}</h3>

                <p>£{invoice.amount}</p>

                <span style={status}>
                  {invoice.status}
                </span>

                {invoice.payment_link && (
                  <a
                    href={invoice.payment_link}
                    target="_blank"
                    rel="noreferrer"
                    style={payButton}
                  >
                    Pay Invoice
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "appointments" && (
          <div style={section}>
            <h2>Appointments</h2>

            {bookings.map((booking) => (
              <div key={booking.id} style={itemCard}>
                <h3>{booking.service}</h3>

                <p>
                  {booking.preferred_date || "Date pending"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const page = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f4f7fb",
  fontFamily: "Arial",
};

const sidebar = {
  width: "250px",
  background: "#071d33",
  color: "white",
  padding: "25px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const logoBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logo = {
  width: "45px",
  height: "45px",
  borderRadius: "12px",
  backgroundColor: "#06b6d4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const brand = {
  margin: 0,
};

const brandSub = {
  margin: 0,
  color: "#67e8f9",
};

const menu = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "40px",
};

const menuButton = {
  background: "transparent",
  border: "none",
  color: "white",
  padding: "14px",
  borderRadius: "10px",
  textAlign: "left",
  cursor: "pointer",
};

const activeButton = {
  ...menuButton,
  backgroundColor: "#06b6d4",
};

const logoutButton = {
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  cursor: "pointer",
};

const main = {
  flex: 1,
  padding: "30px",
};

const header = {
  marginBottom: "30px",
};

const title = {
  margin: 0,
  fontSize: "36px",
};

const subtitle = {
  color: "#64748b",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
};

const card = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "18px",
};

const big = {
  fontSize: "38px",
};

const section = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const itemCard = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "18px",
};

const status = {
  display: "inline-block",
  marginTop: "10px",
  backgroundColor: "#dcfce7",
  color: "#15803d",
  padding: "8px 12px",
  borderRadius: "999px",
};

const payButton = {
  display: "inline-block",
  marginTop: "12px",
  backgroundColor: "#06b6d4",
  color: "white",
  padding: "10px 14px",
  borderRadius: "10px",
  textDecoration: "none",
};

export default CustomerDashboard;