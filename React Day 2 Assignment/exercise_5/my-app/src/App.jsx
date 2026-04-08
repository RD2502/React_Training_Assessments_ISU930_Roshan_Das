
import './App.css'
import { useRef } from 'react'

export default function App() {
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Brown",
    "Black",
    "Gray"
  ];

  const itemRefs = useRef([]);

  const highlight = (index) => {
    const el = itemRefs.current[index];
    if (el) {
      el.style.fontWeight = "bold";
    }
  };

  return (
    <div>
      {colors.map((color, index) => (
        <div key={index} style={{ marginBottom: "8px" }}>
          <span ref={(el) => (itemRefs.current[index] = el)}>
            {color}
          </span>

          <button
            onClick={() => highlight(index)}
            style={{ marginLeft: "10px" }}
          >
            Highlight
          </button>
        </div>
      ))}
    </div>
  );
}