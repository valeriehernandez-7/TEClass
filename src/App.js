import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NewCourse from './app/course/new_course.jsx';
import Menu from './app/user/Menu.jsx';
import CourseList from './app/course/see_courses.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element={<Menu/>}/>
        <Route path="/NewCourse" element={<NewCourse/>}/>
        <Route path="/See_Courses" element={<CourseList/>}/>
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;