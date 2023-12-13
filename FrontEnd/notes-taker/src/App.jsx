import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'

function App() {
 

  return (
    <>
      <Router> 
        <Routes> 
          <Route exact path="/" element={<Home/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
