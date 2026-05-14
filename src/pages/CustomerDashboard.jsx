import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [photos, setPhotos] = useState([]);

  const [requestForm, setRequestForm] = useState({
    service: "",
    preferred_date: "",
    message: "",
  });

  const services = [
    "Domestic Cleaning",
    "Commercial Cleaning",
    "End of Tenancy Cleaning",
    "Carpet Cleaning",
    "Window Cleaning",
    "High Pressure Jet Wash",
    "Garden Maintenance",
    "Property Maintenance",
    "Building Management Support",
    "Cleaning Operatives",
  ];

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    setIsLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session.user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData || null);

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setBookings(bookingData || []);

    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setInvoices(invoiceData || []);
    setIsLoading(false);
  };

const logout = async () => {
  window.location.href = "/logout";
};

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value,
    });
  };
  const handlePhotos = (e) => {
  setPhotos(Array.from(e.target.files));
  };
  const submitRequest = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!requestForm.service || !requestForm.preferred_date) {
      setStatusMessage("Please choose a service and preferred date.");
      return;
    }

    setIsSubmitting(true);

    let uploadedPhotoLinks = [];

for (const photo of photos) {
  const fileName = `${Date.now()}-${photo.name}`;

  const { error: uploadError } = await supabase.storage
    .from("booking-photos")
    .upload(fileName, photo);

  if (uploadError) {
    console.error(uploadError);
    continue;
  }

  const { data } = supabase.storage
    .from("booking-photos")
    .getPublicUrl(fileName);

  uploadedPhotoLinks.push(data.publicUrl);
}

const photoText =
  uploadedPhotoLinks.length > 0
    ? uploadedPhotoLinks.join("\n")
    : "No photos uploaded";

  const fullMessage = `
  Customer dashboard request:

  Preferred date:
  ${requestForm.preferred_date}

  Customer message:
  ${requestForm.message || "No extra message provided."}

  Uploaded photos:
  ${photoText}
  `;

  setRequestForm({
  service: "",
  preferred_date: "",
  message: "",
  });
  setPhotos([]);

    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user?.id || null,
        name: profile?.full_name || user?.email || "Customer",
        phone: profile?.phone || "",
        email: profile?.email || user?.email || "",
        address: profile?.address || "",
        postcode: profile?.postcode || "",
        service: requestForm.service,
        preferred_date: requestForm.preferred_date,
        message: fullMessage,
        status: "new",
      },
    ]);

    if (error) {
      console.error(error);
      setStatusMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    await emailjs.send(
  "service_uv59qba",
  "template_vduqtce",
  {
    name: profile?.full_name || user?.email || "Customer",
    phone: profile?.phone || "",
    email: profile?.email || user?.email || "",
    service: requestForm.service,
    address: profile?.address || "",
    postcode: profile?.postcode || "",
    message: fullMessage,
  },
  "pN9rz35RPIteY-j3g"
);

    setStatusMessage("Your quote request has been sent.");
    setRequestForm({
      service: "",
      preferred_date: "",
      message: "",
    });

    await loadCustomer();
    setIsSubmitting(false);
  };

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      alert("Could not cancel booking.");
      console.error(error);
      return;
    }

    loadCustomer();
  };

  const getInvoiceForBooking = (bookingId) => {
    return invoices.find((invoice) => invoice.booking_id === bookingId);
  };

  const cleanMessage = (message = "") => {
    return String(message)
      .replace(/https:\/\/\S+/g, "")
      .replace("Uploaded photos:", "")
      .trim();
  };

  const formatDate = (date) => {
    if (!date) return "Not selected";

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
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "completed":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "cancelled":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      default:
        return { backgroundColor: "#fef3c7", color: "#92400e" };
    }
  };

  const getInvoiceStatusStyle = (status) => {
    return status === "paid"
      ? { backgroundColor: "#dcfce7", color: "#166534" }
      : { backgroundColor: "#ffedd5", color: "#c2410c" };
  };

  const handlePayment = (invoice) => {
    if (invoice?.payment_link) {
      window.open(invoice.payment_link, "_blank");
      return;
    }

    alert("Payment link has not been added yet.");
  };

  if (isLoading) {
    return <div style={loadingPage}>Loading your dashboard...</div>;
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <p style={eyebrow}>Customer Portal</p>
          <h1 style={title}>Welcome, {profile?.full_name || "Customer"}</h1>
          <p style={subtitle}>
            Request a quote, choose a preferred date, and track your bookings.
          </p>
        </div>

        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </header>

      <main style={main}>
        <section style={requestCard}>
          <div style={sectionTop}>
            <div>
              <h2 style={sectionTitle}>Request a Quote</h2>
              <p style={mutedText}>
                Choose the service you need and select your preferred date.
              </p>
            </div>
          </div>

          <form onSubmit={submitRequest} style={requestGrid}>
            <select
              name="service"
              value={requestForm.service}
              onChange={handleRequestChange}
              style={input}
              required
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="preferred_date"
              value={requestForm.preferred_date}
              onChange={handleRequestChange}
              style={input}
              required
            />

            <textarea
              name="message"
              placeholder="Tell us what you need..."
              value={requestForm.message}
              onChange={handleRequestChange}
              style={textarea}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotos}
              style={input}
              />

            <button type="submit" style={primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Quote Request"}
            </button>
          </form>

          {statusMessage && <p style={statusMessageStyle}>{statusMessage}</p>}
        </section>

        <section style={summaryGrid}>
          <div style={summaryCard}>
            <span style={summaryLabel}>Bookings</span>
            <strong style={summaryNumber}>{bookings.length}</strong>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>Confirmed</span>
            <strong style={summaryNumber}>
              {bookings.filter((b) => b.status === "confirmed").length}
            </strong>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>Invoices</span>
            <strong style={summaryNumber}>{invoices.length}</strong>
          </div>
        </section>

        <section style={contentGrid}>
          <div style={card}>
            <div style={cardHeader}>
              <h2 style={sectionTitle}>My Details</h2>
              <button
                onClick={() => navigate("/edit-profile")}
                style={editButton}
              >
                Edit
              </button>
            </div>

            <div style={detailsGrid}>
              <Info label="Name" value={profile?.full_name} />
              <Info label="Email" value={profile?.email || user?.email} />
              <Info label="Phone" value={profile?.phone} />
              <Info label="Address" value={profile?.address} />
              <Info label="Postcode" value={profile?.postcode} />
            </div>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Latest Invoice</h2>

            {invoices.length === 0 ? (
              <p style={emptyText}>No invoices yet.</p>
            ) : (
              <div style={invoiceMini}>
                <div>
                  <strong>{invoices[0].service}</strong>
                  <p style={mutedText}>{formatMoney(invoices[0].amount)}</p>
                </div>

                <span
                  style={{
                    ...badge,
                    ...getInvoiceStatusStyle(invoices[0].status),
                  }}
                >
                  {invoices[0].status || "unpaid"}
                </span>
              </div>
            )}
          </div>
        </section>

        <section style={card}>
          <div style={cardHeader}>
            <h2 style={sectionTitle}>My Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div style={emptyBox}>
              <h3>No bookings yet</h3>
              <p>Send your first quote request using the form above.</p>
            </div>
          ) : (
            <div style={bookingList}>
              {bookings.map((booking) => {
                const invoice = getInvoiceForBooking(booking.id);
                const readableMessage = cleanMessage(booking.message);

                return (
                  <article key={booking.id} style={bookingCard}>
                    <div style={bookingTop}>
                      <div>
                        <h3 style={bookingTitle}>{booking.service}</h3>
                        <p style={dateText}>
                          Preferred date:{" "}
                          {formatDate(
                            booking.preferred_date || booking.created_at
                          )}
                        </p>
                      </div>

                      <span
                        style={{
                          ...badge,
                          ...getStatusStyle(booking.status),
                        }}
                      >
                        {booking.status || "new"}
                      </span>
                    </div>

                    <div style={bookingDetails}>
                      <Info label="Address" value={booking.address} />
                      <Info label="Postcode" value={booking.postcode} />
                    </div>

                    {invoice && (
                      <div style={invoiceBox}>
                        <div>
                          <strong>Invoice</strong>
                          <p style={mutedText}>{formatMoney(invoice.amount)}</p>
                        </div>

                        <div style={invoiceActions}>
                          <span
                            style={{
                              ...badge,
                              ...getInvoiceStatusStyle(invoice.status),
                            }}
                          >
                            {invoice.status || "unpaid"}
                          </span>

                          <button
                            onClick={() => handlePayment(invoice)}
                            style={paymentButton}
                            disabled={invoice.status === "paid"}
                          >
                            {invoice.status === "paid" ? "Paid" : "Pay"}
                          </button>
                        </div>
                      </div>
                    )}

                    {readableMessage && (
                      <details style={detailsBox}>
                        <summary style={detailsSummary}>Request details</summary>
                        <p style={messageText}>{readableMessage}</p>
                      </details>
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
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={infoItem}>
      <span style={infoLabel}>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

const loadingPage = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  fontSize: "20px",
  fontWeight: "bold",
};

const page = {
  minHeight: "100vh",
  backgroundColor: "#f4f7fb",
  fontFamily: "Arial",
  color: "#17233b",
};

const header = {
  backgroundColor: "#071d33",
  color: "white",
  padding: "34px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
};

const eyebrow = {
  margin: "0 0 8px",
  color: "#56d7e6",
  fontWeight: "bold",
};

const title = {
  fontSize: "34px",
  margin: 0,
  color: "white",
};

const subtitle = {
  margin: "10px 0 0",
  color: "#cbd5e1",
};

const logoutButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#111827",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const main = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "28px 20px",
};

const requestCard = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const sectionTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
};

const sectionTitle = {
  margin: 0,
  fontSize: "24px",
};

const mutedText = {
  color: "#64748b",
  margin: "6px 0 0",
};

const requestGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
  marginTop: "18px",
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d4dde7",
  fontSize: "15px",
};

const textarea = {
  gridColumn: "1 / -1",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d4dde7",
  fontSize: "15px",
  minHeight: "90px",
};

const primaryButton = {
  gridColumn: "1 / -1",
  padding: "14px 20px",
  borderRadius: "12px",
  backgroundColor: "#00a9bd",
  color: "white",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const statusMessageStyle = {
  marginTop: "12px",
  color: "#00a9bd",
  fontWeight: "bold",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const summaryCard = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  textAlign: "center",
};

const summaryLabel = {
  color: "#64748b",
  display: "block",
  marginBottom: "8px",
};

const summaryNumber = {
  fontSize: "30px",
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "18px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const infoItem = {
  backgroundColor: "#f8fafc",
  padding: "14px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const infoLabel = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: "bold",
};

const editButton = {
  padding: "9px 14px",
  backgroundColor: "#00a9bd",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const invoiceMini = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "center",
  backgroundColor: "#f8fafc",
  padding: "16px",
  borderRadius: "14px",
};

const badge = {
  padding: "8px 13px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "capitalize",
};

const emptyBox = {
  backgroundColor: "#f8fafc",
  padding: "26px",
  borderRadius: "18px",
  textAlign: "center",
  color: "#64748b",
};

const emptyText = {
  color: "#64748b",
};

const bookingList = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const bookingCard = {
  backgroundColor: "#f8fafc",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
};

const bookingTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "14px",
};

const bookingTitle = {
  margin: 0,
  fontSize: "21px",
};

const dateText = {
  color: "#64748b",
  margin: "6px 0 0",
};

const bookingDetails = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const invoiceBox = {
  marginTop: "14px",
  backgroundColor: "white",
  padding: "16px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
  borderLeft: "4px solid #16a34a",
};

const invoiceActions = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap",
};

const paymentButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#16a34a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const detailsBox = {
  marginTop: "14px",
  backgroundColor: "white",
  padding: "14px",
  borderRadius: "14px",
};

const detailsSummary = {
  cursor: "pointer",
  fontWeight: "bold",
};

const messageText = {
  whiteSpace: "pre-line",
  lineHeight: "1.6",
};

const bookingActions = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "14px",
};

const cancelButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#dc2626",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default CustomerDashboard;