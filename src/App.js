import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './app/user/Login.jsx';
import Register from './app/user/Register.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
