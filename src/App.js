import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NewCourse from './app/course/new_course.jsx';
import Menu from './app/user/Menu.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element={<Menu/>}/>
        <Route path="/NewCourse" element={<NewCourse/>}/>
      </Routes>
    </Router>
  );
}

export default App;