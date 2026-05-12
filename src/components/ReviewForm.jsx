import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ReviewForm() {
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    review: "",
  });

  useEffect(() => {
    loadUser();
    fetchReviews();
  }, []);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user || null);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) setReviews(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadPhoto = async (photo, label) => {
    if (!photo) return "";

    const fileName = `${Date.now()}-${label}-${photo.name}`;

    const { error } = await supabase.storage
      .from("review-photos")
      .upload(fileName, photo);

    if (error) {
      console.error(error);
      return "";
    }

    const { data } = supabase.storage
      .from("review-photos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const beforePhotoUrl = await uploadPhoto(beforePhoto, "before");
    const afterPhotoUrl = await uploadPhoto(afterPhoto, "after");

    const photoPayload = JSON.stringify({
      before: beforePhotoUrl,
      after: afterPhotoUrl,
    });

    if (editingReviewId) {
      const { error } = await supabase
        .from("reviews")
        .update({
          name: formData.name,
          rating: Number(formData.rating),
          review: formData.review,
          photo_url: photoPayload,
          status: "approved",
        })
        .eq("id", editingReviewId);

      if (error) {
        console.error(error);
        setStatusMessage("Something went wrong while updating your review.");
        return;
      }

      setStatusMessage("Review updated successfully.");
      setEditingReviewId(null);
    } else {
      const { error } = await supabase.from("reviews").insert([
        {
          user_id: user?.id || null,
          name: formData.name,
          rating: Number(formData.rating),
          review: formData.review,
          photo_url: photoPayload,
          status: "approved",
          owner_replay: "",
        },
      ]);

      if (error) {
        console.error(error);
        setStatusMessage("Something went wrong.");
        return;
      }

      setStatusMessage("Thank you for your review!");
    }

    setFormData({ name: "", rating: 5, review: "" });
    setBeforePhoto(null);
    setAfterPhoto(null);
    fetchReviews();
  };

  const editReview = (review) => {
    setEditingReviewId(review.id);

    setFormData({
      name: review.name || "",
      rating: review.rating || 5,
      review: review.review || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error(error);
      setStatusMessage("Something went wrong while deleting your review.");
      return;
    }

    setStatusMessage("Review deleted successfully.");
    fetchReviews();
  };

  const parsePhotos = (photoUrl) => {
    try {
      return JSON.parse(photoUrl);
    } catch {
      return { before: photoUrl, after: "" };
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>Customer Reviews</h2>

      <form onSubmit={submitReview} style={form}>
        <h3 style={formTitle}>
          {editingReviewId ? "Edit your review" : "Leave a review"}
        </h3>

        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          style={input}
        />

        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          style={input}
        >
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>

        <textarea
          name="review"
          placeholder="Tell us about your experience"
          value={formData.review}
          onChange={handleChange}
          rows="5"
          required
          style={textarea}
        />

        <div style={uploadBox}>
          <p style={uploadTitle}>Before photo</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBeforePhoto(e.target.files[0])}
          />

          <div style={{ height: "25px" }} />

          <p style={uploadTitle}>After photo</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAfterPhoto(e.target.files[0])}
          />
        </div>

        <button type="submit" style={button}>
          {editingReviewId ? "Save Changes" : "Submit Review"}
        </button>

        {editingReviewId && (
          <button
            type="button"
            onClick={() => {
              setEditingReviewId(null);
              setFormData({ name: "", rating: 5, review: "" });
            }}
            style={cancelEditButton}
          >
            Cancel Edit
          </button>
        )}

        {statusMessage && <p style={successMessage}>{statusMessage}</p>}
      </form>

      <div style={reviewsGrid}>
        {reviews.map((review) => {
          const photos = parsePhotos(review.photo_url);
          const canManageReview =
            currentUser && review.user_id && currentUser.id === review.user_id;

          return (
            <div key={review.id} style={reviewCard}>
              <h3 style={reviewName}>{review.name}</h3>

              <p style={stars}>{"⭐".repeat(review.rating)}</p>

              <p style={reviewText}>{review.review}</p>

              {canManageReview && (
                <div style={reviewActions}>
                  <button
                    type="button"
                    onClick={() => editReview(review)}
                    style={editButton}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteReview(review.id)}
                    style={deleteButton}
                  >
                    Delete
                  </button>
                </div>
              )}

              {review.owner_replay && (
                <div style={replyBox}>
                  <p style={replyLabel}>Reply from Environ Facilities</p>

                  <p style={replyText}>{review.owner_replay}</p>
                </div>
              )}

              {(photos.before || photos.after) && (
                <div style={photoGrid}>
                  {photos.before && (
                    <div>
                      <p style={photoLabel}>Before</p>
                      <img
                        src={photos.before}
                        alt="Before"
                        style={reviewImage}
                      />
                    </div>
                  )}

                  {photos.after && (
                    <div>
                      <p style={photoLabel}>After</p>
                      <img
                        src={photos.after}
                        alt="After"
                        style={reviewImage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const container = {
  padding: "70px 20px",
  backgroundColor: "#ffffff",
};

const title = {
  textAlign: "center",
  fontSize: "34px",
  color: "#1c2b44",
  marginBottom: "35px",
};

const form = {
  maxWidth: "750px",
  margin: "0 auto 60px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  backgroundColor: "#f5f7fb",
  padding: "35px",
  borderRadius: "22px",
};

const formTitle = {
  textAlign: "center",
  color: "#1c2b44",
  marginTop: 0,
};

const input = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #d4dde7",
  fontSize: "17px",
};

const textarea = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #d4dde7",
  fontSize: "17px",
  minHeight: "140px",
};

const uploadBox = {
  border: "2px dashed #00BCD4",
  borderRadius: "16px",
  padding: "25px",
  textAlign: "center",
};

const uploadTitle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#1c2b44",
  marginBottom: "12px",
};

const button = {
  backgroundColor: "#00BCD4",
  color: "#ffffff",
  border: "none",
  padding: "18px",
  borderRadius: "14px",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const cancelEditButton = {
  backgroundColor: "#111",
  color: "#ffffff",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const successMessage = {
  color: "#00BCD4",
  fontWeight: "bold",
  textAlign: "center",
};

const reviewsGrid = {
  maxWidth: "1300px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "28px",
};

const reviewCard = {
  backgroundColor: "#f5f7fb",
  padding: "28px",
  borderRadius: "24px",
};

const reviewName = {
  fontSize: "34px",
  color: "#1c2b44",
  textAlign: "center",
  marginBottom: "12px",
};

const reviewActions = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "16px",
};

const editButton = {
  padding: "9px 14px",
  backgroundColor: "#00BCD4",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const deleteButton = {
  padding: "9px 14px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const replyBox = {
  marginTop: "14px",
  marginBottom: "18px",
  padding: "12px 14px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  borderLeft: "3px solid #00BCD4",
  textAlign: "left",
  maxWidth: "520px",
  marginLeft: "auto",
  marginRight: "auto",
};

const replyLabel = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#00BCD4",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const replyText = {
  margin: 0,
  color: "#1c2b44",
  fontSize: "14px",
  lineHeight: "1.5",
};

const stars = {
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "14px",
};

const reviewText = {
  textAlign: "center",
  fontSize: "20px",
  color: "#1c2b44",
  lineHeight: "1.7",
};

const photoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginTop: "25px",
};

const photoLabel = {
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "700",
  color: "#1c2b44",
  marginBottom: "10px",
};

const reviewImage = {
  width: "100%",
  height: "280px",
  objectFit: "cover",
  borderRadius: "18px",
};

export default ReviewForm;