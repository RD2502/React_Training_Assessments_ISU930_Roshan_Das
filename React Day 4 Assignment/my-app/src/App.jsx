import { useState } from "react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import "./App.css";

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);

  function handleNewFeedback(newFb) {
    setFeedbacks((prev) => [newFb, ...prev]);
  }

  return (
    <div className="app-container">
      <h1>Smart Feedback App</h1>

      <FeedbackForm onNewFeedback={handleNewFeedback} />

      <hr />

      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}