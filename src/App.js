import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import { useEffect } from 'react';
import socketService from './Functions/socketService';
import { initializeApp } from "firebase/app";

function App() {
  useEffect(() => {
    socketService.connect("675aac3c5a5c76cac0e428c9");
    return () => {
      socketService.disconnect();
    };
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    
    </BrowserRouter>
  );
}
export default App;
