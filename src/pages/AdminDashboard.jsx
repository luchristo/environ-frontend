import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
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
      fetchReviews();
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

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data);
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

  const updateReviewStatus = async (id, status) => {
    await supabase.from("reviews").update({ status }).eq("id", id);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete review. Check your Supabase DELETE policy.");
      return;
    }

    fetchReviews();
  };

  const saveReply = async (id, owner_replay) => {
    await supabase.from("reviews").update({ owner_replay }).eq("id", id);
    fetchReviews();
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

  if (checkingAdmin) {
    return (
      <div style={loadingPage}>
        Checking admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <h1 style={title}>Admin Dashboard</h1>
          <p style={subtitle}>Manage bookings, quotes, invoices and reviews.</p>
        </div>

        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </header>

      <main style={main}>
        <section style={section}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Bookings</h2>
            <span style={countBadge}>{bookings.length} total</span>
          </div>

          {bookings.length === 0 ? (
            <div style={emptyBox}>No bookings yet.</div>
          ) : (
            <div style={grid}>
              {bookings.map((booking) => {
                const photoLinks = getPhotoLinks(booking.message);
                const invoiceValue = invoiceInputs[booking.id] || {};
                const readableMessage = cleanBookingMessage(booking.message);

                return (
                  <div key={booking.id} style={card}>
                    <div style={cardTop}>
                      <div>
                        <h3 style={cardTitle}>{booking.name}</h3>
                        <p style={smallText}>{booking.service}</p>
                      </div>

                      <span style={statusBadge}>{booking.status || "new"}</span>
                    </div>

                    <div style={detailsBox}>
                      <p><strong>Phone:</strong> {booking.phone}</p>
                      <p><strong>Email:</strong> {booking.email}</p>
                      <p><strong>Address:</strong> {booking.address}</p>
                      <p><strong>Postcode:</strong> {booking.postcode}</p>
                    </div>

                    {readableMessage && (
                      <div style={messageBox}>
                        <strong>Request details</strong>
                        <p style={messageText}>{readableMessage}</p>
                      </div>
                    )}

                    {photoLinks.length > 0 && (
                      <div style={photoBox}>
                        <strong>Uploaded photos</strong>

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

                    <div style={invoiceBox}>
                      <h4 style={invoiceTitle}>Quote / Invoice</h4>

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
                        style={invoiceInput}
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
                        style={invoiceInput}
                      />

                      <textarea
                        placeholder="Quote / invoice notes"
                        value={invoiceValue.notes || ""}
                        onChange={(e) =>
                          handleInvoiceChange(
                            booking.id,
                            "notes",
                            e.target.value
                          )
                        }
                        style={invoiceTextarea}
                      />

                      <div style={invoiceActions}>
                        <button
                          style={invoiceButton}
                          onClick={() => createInvoice(booking)}
                        >
                          Create Invoice + Send
                        </button>

                        <button
                          style={purpleButton}
                          onClick={() => sendQuoteWhatsApp(booking)}
                        >
                          Send WhatsApp Only
                        </button>

                        <button
                          style={blueButton}
                          onClick={async () => {
                            const sent = await sendQuoteEmail(booking);
                            if (sent) alert("Quote email sent successfully.");
                          }}
                        >
                          Send Email Only
                        </button>
                      </div>
                    </div>

                    <div style={buttonGroup}>
                      <button
                        style={blueButton}
                        onClick={() =>
                          updateBookingStatus(booking.id, "confirmed")
                        }
                      >
                        Confirm
                      </button>

                      <button
                        style={greenButton}
                        onClick={() =>
                          updateBookingStatus(booking.id, "completed")
                        }
                      >
                        Complete
                      </button>

                      <button
                        style={redButton}
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

        <section style={section}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Reviews</h2>
            <span style={countBadge}>{reviews.length} total</span>
          </div>

          {reviews.length === 0 ? (
            <div style={emptyBox}>No reviews yet.</div>
          ) : (
            <div style={grid}>
              {reviews.map((review) => (
                <div key={review.id} style={card}>
                  <div style={cardTop}>
                    <div>
                      <h3 style={cardTitle}>{review.name}</h3>
                      <p style={stars}>{"⭐".repeat(review.rating)}</p>
                    </div>

                    <span style={statusBadge}>{review.status}</span>
                  </div>

                  <p style={reviewText}>{review.review}</p>

                  <div style={buttonGroup}>
                    <button
                      style={blueButton}
                      onClick={() =>
                        updateReviewStatus(review.id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      style={redButton}
                      onClick={() => updateReviewStatus(review.id, "hidden")}
                    >
                      Hide
                    </button>

                    <button
                      style={darkRedButton}
                      onClick={() => deleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <label style={label}>Business reply</label>

                  <textarea
                    placeholder="Write your reply..."
                    defaultValue={review.owner_replay || ""}
                    onBlur={(e) => saveReply(review.id, e.target.value)}
                    style={textarea}
                  />

                  <p style={hint}>
                    Reply saves automatically when you click outside the box.
                  </p>
                </div>
              ))}
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
  fontSize: "22px",
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
  padding: "26px 36px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  gap: "20px",
};

const title = { fontSize: "34px", margin: 0 };
const subtitle = { margin: "8px 0 0", color: "#5b6b84", fontSize: "16px" };

const logoutButton = {
  padding: "12px 22px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#111",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const main = { maxWidth: "1250px", margin: "0 auto", padding: "36px 20px" };
const section = { marginBottom: "48px" };

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const sectionTitle = { fontSize: "28px", margin: 0 };

const countBadge = {
  backgroundColor: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  color: "#5b6b84",
};

const emptyBox = {
  backgroundColor: "white",
  padding: "28px",
  borderRadius: "16px",
  color: "#5b6b84",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: "22px",
};

const card = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "16px",
};

const cardTitle = { margin: 0, fontSize: "22px" };

const smallText = {
  margin: "6px 0 0",
  color: "#5b6b84",
  fontWeight: "bold",
};

const statusBadge = {
  backgroundColor: "#eef7f9",
  color: "#00BCD4",
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "capitalize",
};

const detailsBox = {
  backgroundColor: "#fbfcfe",
  padding: "14px",
  borderRadius: "12px",
  lineHeight: "1.5",
};

const messageBox = {
  backgroundColor: "#f5f7fb",
  padding: "14px",
  borderRadius: "12px",
  marginTop: "12px",
};

const messageText = {
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  lineHeight: "1.55",
};

const photoBox = {
  marginTop: "14px",
  padding: "14px",
  backgroundColor: "#fbfcfe",
  borderRadius: "12px",
};

const photoLinksBox = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "10px",
};

const photoLink = {
  backgroundColor: "#00BCD4",
  color: "white",
  padding: "9px 12px",
  borderRadius: "10px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
};

const invoiceBox = {
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#f5f7fb",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const invoiceTitle = {
  margin: 0,
  fontSize: "18px",
};

const invoiceInput = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d4dde7",
  fontSize: "15px",
};

const invoiceTextarea = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d4dde7",
  fontSize: "15px",
  minHeight: "80px",
};

const invoiceActions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const invoiceButton = {
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const purpleButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#9C27B0",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const buttonGroup = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const blueButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#00BCD4",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const greenButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const redButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#f44336",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const darkRedButton = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#b71c1c",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const stars = { fontSize: "20px", margin: "6px 0 0" };

const reviewText = {
  lineHeight: "1.6",
  backgroundColor: "#f5f7fb",
  padding: "14px",
  borderRadius: "12px",
};

const label = {
  display: "block",
  marginTop: "18px",
  marginBottom: "8px",
  fontWeight: "bold",
};

const textarea = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d4dde7",
  minHeight: "100px",
  fontSize: "16px",
  boxSizing: "border-box",
};

const hint = {
  fontSize: "13px",
  color: "#5b6b84",
  marginTop: "6px",
};

export default AdminDashboard;