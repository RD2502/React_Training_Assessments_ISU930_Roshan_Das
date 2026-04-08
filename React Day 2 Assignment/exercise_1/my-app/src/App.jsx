import { useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const handleChange = (e, nextRef) => {
    if (e.target.value.length === 4) {
      nextRef.current.focus();
    }
  };

  return (
    <>
       <div style={{ display: "flex", gap: "10px" }}>
      <input
        ref={input1Ref}
        maxLength={4}
        onChange={(e) => handleChange(e, input2Ref)}
      />

      <input
        ref={input2Ref}
        maxLength={4}
        onChange={(e) => handleChange(e, input3Ref)}
      />

      <input
        ref={input3Ref}
        maxLength={4}
      />
    </div>
    </>
  )
}

export default App
