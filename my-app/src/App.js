import React, { useState } from 'react';
import logo from './images/logo.png';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ChessGame from './components/Chess';
function App() {
  const[ showSignup, setShowSignup ] = useState(false)
  return (
    <Router>
        <Routes>
         <Route exact path = "/" element = {<Login/>}></Route>
         <Route exact path = "/signup" element = {<SignUp/>}></Route>
         <Route exact path = "/home" element = {<ChessGame/>}></Route>
        </Routes>
    </Router>
  );
}

export default App;