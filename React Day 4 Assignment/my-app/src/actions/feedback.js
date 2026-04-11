export function submitFeedback(data) {
  const { name, message, rating } = data;

  if (!name || !message || !rating) {
    return { success: false, error: "All fields are required" };
  }

  const newFeedback = {
    id: Date.now(),
    name,
    message,
    rating: Number(rating),
  };

  return { success: true, data: newFeedback };
}