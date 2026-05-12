import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    const user = session.user;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (bookingData) setBookings(bookingData);

    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (invoiceData) setInvoices(invoiceData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    loadCustomer();
  };

  const getInvoiceForBooking = (bookingId) => {
    return invoices.find((invoice) => invoice.booking_id === bookingId);
  };

  const getPhotoLinks = (message = "") => {
    return message
      .split(/\s+/)
      .filter((text) => text.startsWith("https://"));
  };

  const cleanMessage = (message = "") => {
    return message
      .replace(/https:\/\/\S+/g, "")
      .replace("Uploaded photos:", "")
      .trim();
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMoney = (amount) => {
    return `£${Number(amount || 0).toFixed(2)}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
      case "completed":
        return { backgroundColor: "#d7ffd9", color: "#1b5e20" };
      case "cancelled":
        return { backgroundColor: "#ffebee", color: "#c62828" };
      default:
        return { backgroundColor: "#e3f2fd", color: "#1565c0" };
    }
  };

  const getInvoiceStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
      default:
        return { backgroundColor: "#fff3e0", color: "#ef6c00" };
    }
  };

  const handlePayment = (invoice) => {
    if (invoice?.payment_link) {
      window.open(invoice.payment_link, "_blank");
      return;
    }

    alert("Payment link has not been added yet.");
  };

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <h1 style={title}>Customer Dashboard</h1>
          <p style={subtitle}>View your bookings, invoices and account details.</p>
        </div>

        <div style={headerButtons}>
          <Link to="/" style={servicesButton}>
            Go to Services
          </Link>

          <button onClick={logout} style={logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={main}>
        <section style={detailsCard}>
          <h2 style={sectionTitle}>My Details</h2>

          {profile ? (
            <>
              <div style={detailsGrid}>
                <p><strong>Name:</strong> {profile.full_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Address:</strong> {profile.address || "Not added yet"}</p>
                <p><strong>Postcode:</strong> {profile.postcode || "Not added yet"}</p>
              </div>

              <button
                onClick={() => navigate("/edit-profile")}
                style={editButton}
              >
                Edit Details
              </button>
            </>
          ) : (
            <p style={emptyText}>Loading profile...</p>
          )}
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>My Bookings</h2>

          {bookings.length === 0 ? (
            <p style={emptyText}>No bookings yet.</p>
          ) : (
            bookings.map((booking) => {
              const invoice = getInvoiceForBooking(booking.id);
              const photoLinks = getPhotoLinks(booking.message);
              const readableMessage = cleanMessage(booking.message);

              return (
                <div key={booking.id} style={bookingCard}>
                  <div style={bookingHeader}>
                    <div>
                      <h3 style={bookingTitle}>{booking.service}</h3>
                      <p style={dateText}>
                        Requested on {formatDate(booking.created_at)}
                      </p>
                    </div>

                    <span
                      style={{
                        ...statusBadge,
                        ...getStatusStyle(booking.status),
                      }}
                    >
                      {booking.status || "new"}
                    </span>
                  </div>

                  <div style={bookingDetails}>
                    <p><strong>Address:</strong> {booking.address}</p>
                    <p><strong>Postcode:</strong> {booking.postcode}</p>
                  </div>

                  {invoice ? (
                    <div style={invoiceBox}>
                      <div style={invoiceHeader}>
                        <div>
                          <h4 style={invoiceTitle}>Invoice #{invoice.id}</h4>
                          <p><strong>Amount:</strong> {formatMoney(invoice.amount)}</p>
                          {invoice.notes && (
                            <p><strong>Notes:</strong> {invoice.notes}</p>
                          )}
                        </div>

                        <span
                          style={{
                            ...invoiceBadge,
                            ...getInvoiceStatusStyle(invoice.status),
                          }}
                        >
                          {invoice.status || "unpaid"}
                        </span>
                      </div>

                      <button
                        onClick={() => window.open(invoice.payment_link, "_blank")}
                        style={paymentButton}
                        disabled={invoice.status === "paid"}
                      >
                        {invoice.status === "paid" ? "Paid" : "Pay Invoice"}
                      </button>
                    </div>
                  ) : (
                    booking.status === "confirmed" && (
                      <div style={invoicePendingBox}>
                        Invoice pending. The business will send your invoice soon.
                      </div>
                    )
                  )}

                  {readableMessage && (
                    <div style={messageBox}>
                      <strong>Request details</strong>
                      <p style={messageText}>{readableMessage}</p>
                    </div>
                  )}

                  {photoLinks.length > 0 && (
                    <div style={photoBox}>
                      <strong>Photos</strong>

                      <div style={photoLinksBox}>
                        {photoLinks.map((link, index) => (
                          <a
                            key={link}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            style={photoLink}
                          >
                            View photo {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.status !== "cancelled" &&
                    booking.status !== "completed" && (
                      <div style={bookingActions}>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          style={cancelButton}
                        >
                          Cancel booking
                        </button>
                      </div>
                    )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  fontFamily: "Arial",
  color: "#1c2b44",
};

const header = {
  backgroundColor: "white",
  padding: "26px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  gap: "20px",
  flexWrap: "wrap",
};

const headerButtons = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const title = {
  fontSize: "34px",
  margin: 0,
};

const subtitle = {
  margin: "8px 0 0",
  color: "#5b6b84",
};

const servicesButton = {
  padding: "11px 20px",
  borderRadius: "12px",
  backgroundColor: "#00BCD4",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const logoutButton = {
  padding: "11px 20px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#111",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const main = {
  maxWidth: "1050px",
  margin: "0 auto",
  padding: "40px 20px",
};

const card = {
  backgroundColor: "white",
  padding: "28px",
  borderRadius: "20px",
  marginBottom: "28px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
};

const detailsCard = {
  ...card,
};

const sectionTitle = {
  fontSize: "28px",
  marginTop: 0,
  textAlign: "center",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px 25px",
};

const editButton = {
  display: "block",
  margin: "18px auto 0",
  padding: "10px 18px",
  backgroundColor: "#00BCD4",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const emptyText = {
  textAlign: "center",
  color: "#5b6b84",
};

const bookingCard = {
  backgroundColor: "#f5f7fb",
  padding: "24px",
  borderRadius: "18px",
  marginTop: "18px",
};

const bookingHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  alignItems: "flex-start",
};

const bookingTitle = {
  margin: 0,
  fontSize: "24px",
};

const dateText = {
  margin: "7px 0 0",
  color: "#5b6b84",
  fontSize: "14px",
};

const statusBadge = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "capitalize",
};

const bookingDetails = {
  backgroundColor: "white",
  padding: "16px",
  borderRadius: "14px",
  marginTop: "16px",
  textAlign: "center",
};

const invoiceBox = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "16px",
  marginTop: "16px",
  borderLeft: "5px solid #4CAF50",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const invoiceHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const invoiceTitle = {
  margin: "0 0 8px",
  fontSize: "22px",
};

const invoiceBadge = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "capitalize",
};

const invoicePendingBox = {
  backgroundColor: "#fff3e0",
  color: "#ef6c00",
  padding: "14px",
  borderRadius: "12px",
  marginTop: "16px",
  fontWeight: "bold",
  textAlign: "center",
};

const messageBox = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "14px",
  marginTop: "14px",
  textAlign: "center",
};

const messageText = {
  whiteSpace: "pre-line",
  lineHeight: "1.6",
  marginBottom: 0,
};

const photoBox = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "14px",
  marginTop: "14px",
  textAlign: "center",
};

const photoLinksBox = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "10px",
};

const photoLink = {
  backgroundColor: "#00BCD4",
  color: "white",
  padding: "10px 14px",
  borderRadius: "10px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
};

const bookingActions = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const paymentButton = {
  marginTop: "14px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const cancelButton = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#f44336",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default CustomerDashboard;