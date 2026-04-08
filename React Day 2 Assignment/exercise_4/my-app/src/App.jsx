import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Product from './components/component'

function App() {
  return (
    <>
     <Product name="Fan" price={999}/>
    </>
  )
}

export default App
