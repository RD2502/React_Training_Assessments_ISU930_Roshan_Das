import { useState } from 'react'
import './App.css'

function App() {
  const [users] = useState([
    { id: 11, name: "Roshan", isAdmin: true },
    { id: 22, name: "Virag", isAdmin: false },
    { id: 33, name: "Ani", isAdmin: true },
    { id: 44, name: "Divya", isAdmin: false },
    { id: 55, name: "Sanjay", isAdmin: true }
  ]);

  const [showAdmins, setShowAdmins] = useState(false);

  const filteredUsers = showAdmins
    ? users.filter(user => user.isAdmin)
    : users;
  return (
    <>
      <div>
      <button onClick={() => setShowAdmins(!showAdmins)}>
        {showAdmins ? "Show All Users" : "Show Only Admins"}
      </button>

      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            {user.name} {user.isAdmin && "(Admin)"}
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}

export default App
