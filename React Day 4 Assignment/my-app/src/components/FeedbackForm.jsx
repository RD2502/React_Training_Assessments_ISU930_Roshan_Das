import { useState } from "react";
import "./FeedbackForm.css";
import { submitFeedback } from "../actions/feedback";

export default function FeedbackForm({ onNewFeedback }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      message: formData.get("message"),
      rating: formData.get("rating"),
    };

    const res = submitFeedback(data);

    if (!res.success) {
      setError(res.error);
      setLoading(false);
      return;
    }

    onNewFeedback(res.data);
    e.target.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Your Name" required />
      <textarea name="message" placeholder="Your Feedback" required />

      <select name="rating" required>
        <option value="">Rate</option>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐⭐</option>
        <option value="3">3 ⭐⭐⭐</option>
        <option value="4">4 ⭐⭐⭐⭐</option>
        <option value="5">5 ⭐⭐⭐⭐⭐</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}