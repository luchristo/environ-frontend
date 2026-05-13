import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [invoiceInputs, setInvoiceInputs] = useState({});
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin-login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        alert("You are not allowed to access the admin dashboard.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchBookings();
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setCheckingAdmin(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBookings(data);
  };

  const updateBookingStatus = async (id, status) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
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
📞 07404 536265
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
    return message.split(/\s+/).filter((text) => text.startsWith("https://"));
  };

  const cleanBookingMessage = (message = "") => {
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

  const getBookingCount = (status) => {
    return bookings.filter((booking) => booking.status === status).length;
  };

  if (checkingAdmin) {
    return <div style={loadingPage}>Checking admin access...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <h1 style={title}>Admin Dashboard</h1>
          <p style={subtitle}>Manage bookings, quotes and invoices.</p>
        </div>

        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </header>

      <main style={main}>
        <section style={summaryGrid}>
          <div style={summaryCard}>
            <span style={summaryLabel}>Total bookings</span>
            <strong style={summaryNumber}>{bookings.length}</strong>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>New</span>
            <strong style={summaryNumber}>{getBookingCount("new")}</strong>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>Confirmed</span>
            <strong style={summaryNumber}>{getBookingCount("confirmed")}</strong>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>Completed</span>
            <strong style={summaryNumber}>{getBookingCount("completed")}</strong>
          </div>
        </section>

        <section style={section}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Booking Requests</h2>
            <button onClick={fetchBookings} style={refreshButton}>
              Refresh
            </button>
          </div>

          {bookings.length === 0 ? (
            <div style={emptyBox}>No bookings yet.</div>
          ) : (
            <div style={bookingList}>
              {bookings.map((booking) => {
                const photoLinks = getPhotoLinks(booking.message);
                const invoiceValue = invoiceInputs[booking.id] || {};
                const readableMessage = cleanBookingMessage(booking.message);

                return (
                  <div key={booking.id} style={bookingCard}>
                    <div style={bookingTop}>
                      <div>
                        <h3 style={bookingName}>{booking.name}</h3>
                        <p style={bookingMeta}>
                          {booking.service} • {formatDate(booking.created_at)}
                        </p>
                      </div>

                      <span style={statusBadge}>{booking.status || "new"}</span>
                    </div>

                    <div style={detailsGrid}>
                      <p><strong>Phone:</strong> {booking.phone}</p>
                      <p><strong>Email:</strong> {booking.email}</p>
                      <p><strong>Postcode:</strong> {booking.postcode}</p>
                      <p><strong>Address:</strong> {booking.address}</p>
                    </div>

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
                              Photo {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={quoteBox}>
                      <h4 style={quoteTitle}>Send Quote / Invoice</h4>

                      <div style={quoteGrid}>
                        <input
                          type="number"
                          placeholder="Amount e.g. 180"
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
                    </div>

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
                  </div>
                );
              })}
            </div>
          )}
        </section>
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
  backgroundColor: "#f5f7fb",
  fontFamily: "Arial",
  color: "#1c2b44",
};

const header = {
  backgroundColor: "white",
  padding: "22px 34px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  gap: "20px",
};

const title = {
  fontSize: "30px",
  margin: 0,
};

const subtitle = {
  margin: "6px 0 0",
  color: "#5b6b84",
  fontSize: "15px",
};

const logoutButton = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const main = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "28px 18px",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "28px",
};

const summaryCard = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const summaryLabel = {
  display: "block",
  color: "#5b6b84",
  fontSize: "14px",
  marginBottom: "8px",
};

const summaryNumber = {
  fontSize: "26px",
};

const section = {
  marginBottom: "34px",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const sectionTitle = {
  fontSize: "24px",
  margin: 0,
};

const refreshButton = {
  padding: "9px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#00BCD4",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const emptyBox = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "14px",
  color: "#5b6b84",
};

const bookingList = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const bookingCard = {
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const bookingTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "14px",
};

const bookingName = {
  margin: 0,
  fontSize: "21px",
};

const bookingMeta = {
  margin: "5px 0 0",
  color: "#5b6b84",
  fontSize: "14px",
};

const statusBadge = {
  backgroundColor: "#eef7f9",
  color: "#00BCD4",
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "capitalize",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "6px 18px",
  backgroundColor: "#f8fafc",
  padding: "14px",
  borderRadius: "12px",
  lineHeight: "1.4",
};

const messageBox = {
  backgroundColor: "#f8fafc",
  padding: "14px",
  borderRadius: "12px",
  marginTop: "12px",
};

const messageText = {
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  lineHeight: "1.5",
  marginBottom: 0,
};

const photoBox = {
  marginTop: "12px",
  padding: "14px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
};

const photoLinksBox = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "9px",
};

const photoLink = {
  backgroundColor: "#00BCD4",
  color: "white",
  padding: "8px 11px",
  borderRadius: "9px",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "bold",
};

const quoteBox = {
  marginTop: "14px",
  padding: "14px",
  backgroundColor: "#f5f7fb",
  borderRadius: "14px",
};

const quoteTitle = {
  margin: "0 0 12px",
  fontSize: "17px",
};

const quoteGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const input = {
  padding: "11px",
  borderRadius: "10px",
  border: "1px solid #d4dde7",
  fontSize: "14px",
};

const textarea = {
  width: "100%",
  marginTop: "10px",
  padding: "11px",
  borderRadius: "10px",
  border: "1px solid #d4dde7",
  fontSize: "14px",
  minHeight: "76px",
  boxSizing: "border-box",
};

const actionRow = {
  display: "flex",
  gap: "9px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const sendButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const whatsappButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#25D366",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const emailButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#00BCD4",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const statusActions = {
  display: "flex",
  gap: "9px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const smallBlueButton = {
  padding: "9px 13px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#00BCD4",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallGreenButton = {
  padding: "9px 13px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallRedButton = {
  padding: "9px 13px",
  border: "none",
  borderRadius: "9px",
  backgroundColor: "#f44336",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default AdminDashboard;