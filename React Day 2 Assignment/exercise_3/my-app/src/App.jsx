import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

 function App() {
  const [messages, setMessages] = useState([
    "Hello 👋",
    "Welcome!",
    "This is a chat"
  ]);

  const bottomRef = useRef(null);

  const addMessage = () => {
    setMessages(prev => [
      ...prev,
      `New message ${prev.length + 1}`
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <div
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid gray",
          padding: "10px"
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}

        <div ref={bottomRef} />
      </div>

      <button onClick={addMessage}>
        Add Message
      </button>
    </div>
  );
}
export default App
