import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './app/user/Login.jsx';
import Register from './app/user/Register.jsx';
import Menu from './app/user/Menu.jsx';
import EditProfile from './app/user/EditProfile.jsx';
import SearchUser from './app/user/SearchUser.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/friends/search" element={<SearchUser />} />
      </Routes>
    </Router>
  );
}

export default App;
