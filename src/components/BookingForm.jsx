import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { supabase } from "../lib/supabase";

function BookingForm({ service, options }) {
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    postcode: "",
    address: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    loadLoggedInUser();
  }, []);

  const loadLoggedInUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user || null);

    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  };

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotos = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const uploadedPhotoLinks = [];

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

      const optionsText =
        selectedOptions.join(", ") || "No extra options selected";

      const photoText =
        uploadedPhotoLinks.length > 0
          ? uploadedPhotoLinks.join("\n")
          : "No photos uploaded";

      const fullMessage = `
Selected options:
${optionsText}

Customer message:
${formData.message}

Uploaded photos:
${photoText}
      `;

      const { error } = await supabase.from("bookings").insert([
        {
          user_id: user?.id || null,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          postcode: formData.postcode,
          service,
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
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service,
          address: formData.address,
          postcode: formData.postcode,
          message: fullMessage,
        },
        "pN9rz35RPIteY-j3g"
      );

      const whatsappMessage = `
New Booking Request

Service: ${service}

Options:
${optionsText}

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

Address:
${formData.address}

Postcode:
${formData.postcode}

Message:
${formData.message}

Photos:
${photoText}
      `;

      const whatsappUrl = `https://wa.me/447404536265?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      setStatusMessage("Booking request sent successfully.");

      setSelectedOptions([]);
      setPhotos([]);

      setFormData({
        postcode: "",
        address: "",
        name: "",
        phone: "",
        email: user?.email || "",
        message: "",
      });

      setCurrentUser(user || null);

      if (user) {
        setTimeout(() => {
          navigate("/customer-dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div style={container}>
      <h2 style={title}>Book {service}</h2>

      {!currentUser && (
        <p style={loginNotice}>
          You can book without an account, but logging in lets you track your
          booking from your customer dashboard.
        </p>
      )}

      <div style={optionsBox}>
        <h3 style={smallTitle}>Choose what you need</h3>

        {options.map((option) => (
          <div key={option} style={optionRow}>
            <span>{option}</span>

            <button
              type="button"
              onClick={() => toggleOption(option)}
              style={{
                ...addButton,
                backgroundColor: selectedOptions.includes(option)
                  ? "#00BCD4"
                  : "white",
                color: selectedOptions.includes(option) ? "white" : "#00BCD4",
              }}
            >
              {selectedOptions.includes(option) ? "Added" : "+"}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={submitBooking} style={form}>
        <h3 style={smallTitle}>Where should we serve you?</h3>

        <input
          name="postcode"
          placeholder="Postcode"
          value={formData.postcode}
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="address"
          placeholder="Property address"
          value={formData.address}
          onChange={handleChange}
          required
          style={input}
        />

        <h3 style={smallTitle}>Your contact details</h3>

        <input
          name="name"
          placeholder="Full name"
          value={formData.name}
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

        <textarea
          name="message"
          placeholder="Any extra details?"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          style={input}
        />

        <div style={uploadBox}>
          <label style={uploadLabel}>Upload photos for a better quote</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotos}
          />

          {photos.length > 0 && (
            <p style={photoText}>{photos.length} photo(s) selected</p>
          )}
        </div>

        <button type="submit" style={submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send booking request"}
        </button>

        {statusMessage && <p style={success}>{statusMessage}</p>}
      </form>
    </div>
  );
}

const container = {
  padding: "60px 25px",
  backgroundColor: "#f5f7fb",
};

const title = {
  textAlign: "center",
  fontSize: "42px",
  color: "#1c2b44",
};

const loginNotice = {
  maxWidth: "760px",
  margin: "0 auto 25px",
  textAlign: "center",
  backgroundColor: "#eef7f9",
  color: "#1c2b44",
  padding: "14px",
  borderRadius: "12px",
  fontWeight: "bold",
};

const optionsBox = {
  maxWidth: "760px",
  margin: "35px auto",
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "22px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};

const optionRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 0",
  borderBottom: "1px solid #d5deea",
  fontSize: "20px",
};

const addButton = {
  width: "90px",
  padding: "10px",
  borderRadius: "12px",
  border: "2px solid #00BCD4",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const form = {
  maxWidth: "760px",
  margin: "35px auto",
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "22px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const smallTitle = {
  textAlign: "center",
  fontSize: "28px",
  color: "#1c2b44",
};

const input = {
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #c8d3e0",
  fontSize: "18px",
};

const uploadBox = {
  backgroundColor: "#f5f7fb",
  border: "2px dashed #00BCD4",
  borderRadius: "16px",
  padding: "22px",
  textAlign: "center",
};

const uploadLabel = {
  display: "block",
  fontWeight: "bold",
  fontSize: "18px",
  color: "#1c2b44",
  marginBottom: "12px",
};

const photoText = {
  color: "#00BCD4",
  fontWeight: "bold",
};

const submitButton = {
  marginTop: "15px",
  padding: "18px",
  backgroundColor: "#F44336",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const success = {
  textAlign: "center",
  fontWeight: "bold",
  color: "#00BCD4",
  fontSize: "18px",
};

export default BookingForm;