import "./FeedbackList.css";

export default function FeedbackList({ feedbacks }) {
  return (
    <div className="feedback-list">
      <h2>All Feedback</h2>

      {feedbacks.length === 0 && <p>No feedback yet.</p>}

      {feedbacks.map((fb) => (
        <div key={fb.id} className="feedback-card">
          <h4>{fb.name}</h4>
          <p>{fb.message}</p>
          <p className="rating">{"⭐".repeat(fb.rating)}</p>
        </div>
      ))}
    </div>
  );
}