import React, { use } from "react";

// Fetch users (returns a promise)
const fetchUsers = () =>
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json());

// Call once (outside component)
const usersPromise = fetchUsers();

function UserCard({ user }) {
  return (
    <div style={styles.card}>
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>City:</strong> {user.address.city}</p>
      <p><strong>Company:</strong> {user.company.name}</p>
    </div>
  );
}

function UserGallery() {
  // use() resolves the promise
  const users = use(usersPromise);

  return (
    <div style={styles.container}>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<p>Loading users...</p>}>
      <UserGallery />
    </React.Suspense>
  );
}

// Simple styles
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
    padding: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    background: "#fff",
  },
};