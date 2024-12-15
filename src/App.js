import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Indoor from './pages/Indoor/Indoor';
import { useEffect } from 'react';
import socketService from './Functions/socketService';

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
        <Route path='/indoor' element={<Indoor/>}/>
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
