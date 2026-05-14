import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "../lib/supabase";


function AdminDashboard() {

  const [bookings, setBookings] = useState([]);
  const [invoiceInputs, setInvoiceInputs] = useState({});
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/admin-login";
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
  alert("You are not allowed to access the admin dashboard.");

  await supabase.auth.signOut({ scope: "global" });
  localStorage.clear();
  sessionStorage.clear();

  window.location.replace("/admin-login");
  return;
}

      setIsAdmin(true);
      await fetchBookings();
    } catch (error) {
      console.error(error);
      window.location.href = "/";
    } finally {
      setCheckingAdmin(false);
    }
  };

  const logout = async () => {
  await supabase.auth.signOut({ scope: "global" });

  Object.keys(localStorage).forEach((key) => {
    localStorage.removeItem(key);
  });

  Object.keys(sessionStorage).forEach((key) => {
    sessionStorage.removeItem(key);
  });

  window.location.replace("/admin-login");
};

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setBookings(data || []);
  };

  const updateBookingStatus = async (id, status) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not update booking status.");
      return;
    }

    fetchBookings();
  };

  const handleInvoiceChange = (bookingId, field, value) => {
    setInvoiceInputs((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const getInvoiceData = (booking) => {
    const invoiceData = invoiceInputs[booking.id] || {};

    return {
      amount: invoiceData.amount || "",
      notes: invoiceData.notes || "",
      payment_link: invoiceData.payment_link || "",
    };
  };

  const formatPhoneForWhatsApp = (phone) => {
    let cleanPhone = String(phone || "").replace(/\D/g, "");

    if (cleanPhone.startsWith("0")) {
      cleanPhone = `44${cleanPhone.slice(1)}`;
    }

    if (!cleanPhone.startsWith("44")) {
      cleanPhone = `44${cleanPhone}`;
    }

    return cleanPhone;
  };

  const sendQuoteEmail = async (booking) => {
    const invoiceData = getInvoiceData(booking);

    if (!invoiceData.amount || Number(invoiceData.amount) <= 0) {
      alert("Please enter the quote amount first.");
      return false;
    }

    try {
      await emailjs.send(
        "service_uv59qba",
        "template_fvc0ega",
        {
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          service: booking.service,
          address: booking.address,
          postcode: booking.postcode,
          message: `
Quote for ${booking.service}: £${Number(invoiceData.amount).toFixed(2)}

${invoiceData.notes ? `Notes: ${invoiceData.notes}` : ""}

Please confirm if you would like to go ahead.

Environ Facilities
          `,
        },
        "pN9rz35RPIteY-j3g"
      );

      return true;
    } catch (error) {
      console.error(error);
      alert("Could not send quote email. Check your EmailJS template.");
      return false;
    }
  };

  const sendQuoteWhatsApp = (booking) => {
    const invoiceData = getInvoiceData(booking);

    if (!invoiceData.amount || Number(invoiceData.amount) <= 0) {
      alert("Please enter the quote amount first.");
      return;
    }

    const cleanPhone = formatPhoneForWhatsApp(booking.phone);

    const quoteMessage = `
Hi ${booking.name},

Thank you for your booking request.

Your quote for ${booking.service} is £${Number(invoiceData.amount).toFixed(2)}.

Address: ${booking.address}
Postcode: ${booking.postcode}

${invoiceData.notes ? `Notes: ${invoiceData.notes}` : ""}

Please confirm if you would like to go ahead.

Environ Facilities
07404 536265
`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(quoteMessage)}`,
      "_blank"
    );
  };

  const createInvoice = async (booking) => {
    const invoiceData = getInvoiceData(booking);

    if (!invoiceData.amount || Number(invoiceData.amount) <= 0) {
      alert("Please enter a valid invoice amount.");
      return;
    }

    const { error } = await supabase.from("invoices").insert([
      {
        booking_id: booking.id,
        user_id: booking.user_id || null,
        customer_name: booking.name,
        customer_email: booking.email,
        service: booking.service,
        amount: Number(invoiceData.amount),
        status: "unpaid",
        notes: invoiceData.notes,
        payment_link: invoiceData.payment_link,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Could not create invoice. Check your invoices table and policies.");
      return;
    }

    await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", booking.id);

    const emailSent = await sendQuoteEmail(booking);
    sendQuoteWhatsApp(booking);

    setInvoiceInputs((prev) => ({
      ...prev,
      [booking.id]: {
        amount: "",
        notes: "",
        payment_link: "",
      },
    }));

    fetchBookings();

    alert(
      emailSent
        ? "Invoice created. Email sent and WhatsApp message opened."
        : "Invoice created. WhatsApp message opened, but email was not sent."
    );
  };

  const getPhotoLinks = (message = "") => {
    return String(message)
      .split(/\s+/)
      .filter((text) => text.startsWith("https://"));
  };

  const cleanBookingMessage = (message = "") => {
    return String(message)
      .replace(/https:\/\/\S+/g, "")
      .replace("Uploaded photos:", "")
      .trim();
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBookingCount = (status) => {
  return bookings.filter((booking) => booking.status === status).length;
};

const isMinimizedBooking = (booking) => {
  return booking.status === "confirmed" || booking.status === "completed";
};

const uniqueCustomers = Array.from(
  new Map(
    bookings
      .filter((booking) => booking.email)
      .map((booking) => [booking.email, booking])
  ).values()
);

  if (checkingAdmin) {
    return <div style={loadingPage}>Checking admin access...</div>;
  }

  if (!isAdmin) return null;
  return (
    <div style={page}>
      <aside style={sidebar}>
        <div style={brandBox}>
          <div style={brandIcon}>EF</div>
          <div>
            <h2 style={brandTitle}>Environ</h2>
            <p style={brandSub}>Facilities</p>
          </div>
        </div>

        <nav style={nav}>
          <button
            onClick={() => setActiveTab("dashboard")}
            style={activeTab === "dashboard" ? navActive : navItem}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            style={activeTab === "bookings" ? navActive : navItem}
          >
            Bookings
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            style={activeTab === "invoices" ? navActive : navItem}
          >
            Invoices
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            style={activeTab === "calendar" ? navActive : navItem}
          >
            Calendar
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            style={activeTab === "customers" ? navActive : navItem}
          >
            Customers
          </button>

          <button
            onClick={() => setActiveTab("services")}
            style={activeTab === "services" ? navActive : navItem}
          >
            Services
          </button>
        </nav>

        <div style={helpBox}>
          <p style={helpTitle}>Business support</p>
          <a href="tel:+447404536265" style={helpPhone}>
            07404 536265
          </a>
        </div>

        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </aside>

      <main style={main}>
        <header style={topbar}>
          <div>
            <h1 style={title}>Admin Dashboard</h1>
            <p style={subtitle}>Manage bookings, quotes and invoices.</p>
          </div>

          <button
  onClick={async () => {
    setCheckingAdmin(true);
    await fetchBookings();
    setCheckingAdmin(false);
  }}
  style={refreshButton}
>
  Refresh
</button> 

        </header>

        {activeTab === "dashboard" && (
          <section style={summaryGrid}>
            <div style={summaryCard}>
              <div style={summaryIcon}>📅</div>
              <div>
                <span style={summaryLabel}>Total Bookings</span>
                <strong style={summaryNumber}>{bookings.length}</strong>
              </div>
            </div>

            <div style={summaryCard}>
              <div style={summaryIcon}>🕒</div>
              <div>
                <span style={summaryLabel}>New</span>
                <strong style={summaryNumber}>{getBookingCount("new")}</strong>
              </div>
            </div>
                
            <div style={summaryCard}>
              <div style={summaryIcon}>✅</div>
              <div>
                <span style={summaryLabel}>Confirmed</span>
                <strong style={summaryNumber}>
                  {getBookingCount("confirmed")}
                </strong>
              </div>
            </div>

            <div style={summaryCard}>
              <div style={summaryIcon}>🏁</div>
              <div>
                <span style={summaryLabel}>Completed</span>
                <strong style={summaryNumber}>
                  {getBookingCount("completed")}
                </strong>
              </div>
            </div>
          </section>
        )}

        {(activeTab === "dashboard" || activeTab === "bookings") && (
          <section style={section}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Booking Requests</h2>
              <span style={countBadge}>{bookings.length} total</span>
            </div>

            {bookings.length === 0 ? (
              <div style={emptyBox}>No bookings yet.</div>
            ) : (
              <div style={bookingList}>
                {bookings.map((booking) => {
                  const photoLinks = getPhotoLinks(booking.message);
                  const invoiceValue = invoiceInputs[booking.id] || {};
                  const readableMessage = cleanBookingMessage(booking.message);

                  if (isMinimizedBooking(booking)) {
  return (
    <article key={booking.id} style={miniBookingCard}>
      <div>
        <h3 style={bookingName}>
          {booking.name || "Customer"}
        </h3>

        <p style={bookingMeta}>
          {booking.service} •{" "}
          {formatDate(
            booking.preferred_date || booking.created_at
          )}
        </p>
      </div>

      <div style={miniActions}>
        <span style={statusBadge}>
          {booking.status}
        </span>

        <button
          style={smallBlueButton}
          onClick={() =>
            updateBookingStatus(booking.id, "new")
          }
        >
          Reopen
        </button>
      </div>
    </article>
  );
}

return (
  <article key={booking.id} style={bookingCard}>

                      <div style={bookingHeader}>
                        <div style={customerBlock}>
                          <div style={avatar}>
                            {booking.name?.charAt(0)?.toUpperCase() || "C"}
                          </div>

                          <div>
                            <h3 style={bookingName}>
                              {booking.name || "Customer"}
                            </h3>
                            <p style={bookingMeta}>
                              {booking.service} •{" "}
                              {formatDate(booking.created_at)}
                            </p>
                          </div>
                        </div>

                        <span style={statusBadge}>
                          {booking.status || "new"}
                        </span>
                      </div>

                      <div style={infoGrid}>
                        <div style={infoItem}>
                          <span style={infoLabel}>Phone</span>
                          <strong>{booking.phone || "Not provided"}</strong>
                        </div>

                        <div style={infoItem}>
                          <span style={infoLabel}>Email</span>
                          <strong>{booking.email || "Not provided"}</strong>
                        </div>

                        <div style={infoItem}>
                          <span style={infoLabel}>Postcode</span>
                          <strong>{booking.postcode || "Not provided"}</strong>
                        </div>

                        <div style={infoItem}>
                          <span style={infoLabel}>Address</span>
                          <strong>{booking.address || "Not provided"}</strong>
                        </div>
                      </div>

                      <div style={twoColumn}>
                        <div style={panel}>
                          <h4 style={panelTitle}>Request Details</h4>
                          <p style={messageText}>
                            {readableMessage || "No extra message provided."}
                          </p>
                        </div>

                        <div style={panel}>
                          <h4 style={panelTitle}>Photos</h4>

                          {photoLinks.length === 0 ? (
                            <p style={mutedText}>No photos uploaded.</p>
                          ) : (
                            <div style={photoLinksBox}>
                              {photoLinks.map((link, index) => (
                                <a
                                  key={link}
                                  href={link}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={photoLink}
                                >
                                  View Photo {index + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <details style={quoteBox}>
  <summary style={quoteSummary}>Create Quote / Invoice</summary>

                        <div style={quoteGrid}>
                          <input
                            type="number"
                            placeholder="Amount (£)"
                            value={invoiceValue.amount || ""}
                            onChange={(e) =>
                              handleInvoiceChange(
                                booking.id,
                                "amount",
                                e.target.value
                              )
                            }
                            style={input}
                          />

                          <input
                            type="text"
                            placeholder="Payment link optional"
                            value={invoiceValue.payment_link || ""}
                            onChange={(e) =>
                              handleInvoiceChange(
                                booking.id,
                                "payment_link",
                                e.target.value
                              )
                            }
                            style={input}
                          />
                        </div>

                        <textarea
                          placeholder="Notes for the customer"
                          value={invoiceValue.notes || ""}
                          onChange={(e) =>
                            handleInvoiceChange(
                              booking.id,
                              "notes",
                              e.target.value
                            )
                          }
                          style={textarea}
                        />

                        <div style={actionRow}>
                          <button
                            style={sendButton}
                            onClick={() => createInvoice(booking)}
                          >
                            Create Invoice + Send
                          </button>

                          <button
                            style={whatsappButton}
                            onClick={() => sendQuoteWhatsApp(booking)}
                          >
                            WhatsApp Only
                          </button>

                          <button
                            style={emailButton}
                            onClick={async () => {
                              const sent = await sendQuoteEmail(booking);
                              if (sent) alert("Quote email sent successfully.");
                            }}
                          >
                            Email Only
                          </button>
                        </div>
                      </details>

                      <div style={statusActions}>
                        <button
                          style={smallBlueButton}
                          onClick={() =>
                            updateBookingStatus(booking.id, "confirmed")
                          }
                        >
                          Confirm
                        </button>

                        <button
                          style={smallGreenButton}
                          onClick={() =>
                            updateBookingStatus(booking.id, "completed")
                          }
                        >
                          Complete
                        </button>

                        <button
                          style={smallRedButton}
                          onClick={() =>
                            updateBookingStatus(booking.id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "invoices" && (
          <section style={section}>
            <h2 style={sectionTitle}>Invoices</h2>

            <div style={emptyBox}>
              Invoices are created from each booking card.
              <br />
              <br />
              Current payment status is manual. Automatic paid/unpaid updates
              require Stripe webhooks.
            </div>
          </section>
        )}

        {activeTab === "calendar" && (
          <section style={section}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Booking Calendar</h2>
              <span style={countBadge}>{bookings.length} bookings</span>
            </div>

            <div style={calendarGrid}>
              {bookings.length === 0 ? (
                <div style={emptyBox}>No bookings to show.</div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} style={calendarCard}>
                   <strong>{formatDate(booking.preferred_date || booking.created_at)}</strong>
                    <p style={calendarText}>{booking.name || "Customer"}</p>
                    <p style={calendarText}>{booking.service}</p>
                    <span style={statusBadge}>{booking.status || "new"}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "customers" && (
          <section style={section}>
            <h2 style={sectionTitle}>Customers</h2>

            <div style={bookingList}>
              {uniqueCustomers.length === 0 ? (
                <div style={emptyBox}>No customers yet.</div>
              ) : (
                uniqueCustomers.map((customer) => (
                  <div key={customer.email || customer.id} style={bookingCard}>
                    <h3 style={bookingName}>
                      {customer.name || "Customer"}
                    </h3>

                    <div style={infoGrid}>
                      <div style={infoItem}>
                        <span style={infoLabel}>Phone</span>
                        <strong>{customer.phone || "Not provided"}</strong>
                      </div>

                      <div style={infoItem}>
                        <span style={infoLabel}>Email</span>
                        <strong>{customer.email || "Not provided"}</strong>
                      </div>

                      <div style={infoItem}>
                        <span style={infoLabel}>Address</span>
                        <strong>{customer.address || "Not provided"}</strong>
                      </div>

                      <div style={infoItem}>
                        <span style={infoLabel}>Postcode</span>
                        <strong>{customer.postcode || "Not provided"}</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section style={section}>
            <h2 style={sectionTitle}>Services</h2>

            <div style={emptyBox}>
              Services are currently managed in your service page files inside
              VS Code.
            </div>
          </section>
        )}

        <footer style={footer}>© Environ Facilities</footer>
      </main>
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
  color: "#1c2b44",
};

const page = {
  minHeight: "100vh",
  backgroundColor: "#f4f7fb",
  fontFamily: "Arial",
  color: "#17233b",
  display: "flex",
};

const sidebar = {
  width: "245px",
  background: "linear-gradient(180deg, #071d33 0%, #0b1628 100%)",
  color: "white",
  padding: "24px 18px",
  minHeight: "100vh",
  position: "sticky",
  top: 0,
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "30px",
};

const brandIcon = {
  width: "44px",
  height: "44px",
  borderRadius: "14px",
  backgroundColor: "#00BCD4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const brandTitle = { margin: 0, fontSize: "22px" };
const brandSub = { margin: 0, color: "#56d7e6", fontWeight: "bold" };

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const navActive = {
  backgroundColor: "#00a9bd",
  color: "white",
  border: "none",
  padding: "13px 14px",
  borderRadius: "10px",
  textAlign: "left",
  fontWeight: "bold",
  cursor: "pointer",
};

const navItem = {
  backgroundColor: "transparent",
  color: "#dbeafe",
  border: "none",
  padding: "13px 14px",
  borderRadius: "10px",
  textAlign: "left",
  fontWeight: "bold",
  cursor: "pointer",
};

const helpBox = {
  marginTop: "48px",
  padding: "16px",
  borderRadius: "16px",
  backgroundColor: "rgba(255,255,255,0.08)",
};

const helpTitle = {
  margin: "0 0 10px",
  fontWeight: "bold",
};

const helpPhone = {
  color: "#56d7e6",
  fontWeight: "bold",
  textDecoration: "none",
};

const logoutButton = {
  marginTop: "18px",
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const main = {
  flex: 1,
  padding: "28px",
};

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const title = { fontSize: "34px", margin: 0 };
const subtitle = { margin: "8px 0 0", color: "#64748b" };

const refreshButton = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#00a9bd",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "18px",
  marginBottom: "28px",
};

const summaryCard = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const summaryIcon = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "#e8fbfd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
};

const summaryLabel = {
  display: "block",
  color: "#64748b",
  fontSize: "14px",
  marginBottom: "6px",
};

const summaryNumber = { fontSize: "30px" };
const section = { marginTop: "18px" };

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const sectionTitle = { fontSize: "25px", margin: 0 };

const countBadge = {
  backgroundColor: "white",
  padding: "9px 14px",
  borderRadius: "999px",
  color: "#64748b",
  fontWeight: "bold",
};

const emptyBox = {
  backgroundColor: "white",
  padding: "26px",
  borderRadius: "16px",
  color: "#64748b",
  lineHeight: "1.6",
};

const bookingList = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const bookingCard = {
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const bookingHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
};

const customerBlock = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const avatar = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  backgroundColor: "#00a9bd",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const bookingName = { margin: 0, fontSize: "23px" };

const bookingMeta = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const statusBadge = {
  backgroundColor: "#dcfce7",
  color: "#16a34a",
  padding: "9px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "capitalize",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
  padding: "16px",
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  marginBottom: "14px",
};

const infoItem = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const infoLabel = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: "bold",
};

const twoColumn = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const panel = {
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  padding: "16px",
};

const panelTitle = { margin: "0 0 10px", fontSize: "17px" };

const messageText = {
  whiteSpace: "pre-line",
  lineHeight: "1.55",
  margin: 0,
};

const mutedText = { color: "#64748b", margin: 0 };

const photoLinksBox = {
  display: "flex",
  flexWrap: "wrap",
  gap: "9px",
};

const photoLink = {
  backgroundColor: "#00a9bd",
  color: "white",
  padding: "9px 12px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "13px",
};

const quoteBox = {
  marginTop: "14px",
  padding: "16px",
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
};

const miniBookingCard = {
  backgroundColor: "white",
  padding: "16px 20px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const miniActions = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const quoteSummary = {
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "18px",
  marginBottom: "14px",
  color: "#17233b",
  outline: "none",
};

const quoteGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const input = {
  padding: "12px",
  borderRadius: "11px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
};

const textarea = {
  width: "100%",
  marginTop: "10px",
  padding: "12px",
  borderRadius: "11px",
  border: "1px solid #cbd5e1",
  minHeight: "78px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const actionRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const sendButton = {
  padding: "11px 15px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#16a34a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const whatsappButton = {
  padding: "11px 15px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#22c55e",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const emailButton = {
  padding: "11px 15px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const statusActions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const smallBlueButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#00a9bd",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallGreenButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#16a34a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallRedButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#dc2626",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const calendarCard = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const calendarText = {
  color: "#64748b",
  margin: "8px 0",
};

const footer = {
  textAlign: "center",
  color: "#64748b",
  fontSize: "13px",
  padding: "30px",
};

export default AdminDashboard;

