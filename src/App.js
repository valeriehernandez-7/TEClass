import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './app/user/Login.jsx';
import Register from './app/user/Register.jsx';
import Menu from './app/user/Menu.jsx';
import EditProfile from './app/user/EditProfile.jsx';
import SearchUser from './app/user/SearchUser.jsx';
import Friends from './app/user/Friends.jsx';
import NewCourse from './app/course/new_course.jsx';
import EnrolledIn_Courses from './app/course/EnrolledIn_Courses.jsx';
import CoursesCreated from './app/course/CoursesCreated.jsx';
import CourseList from './app/course/see_courses.jsx';
import CourseViewMore from './app/course/CourseViewMorePROFESSOR.jsx';
import CourseSection from './app/course/section_course.jsx';
import CloneCourse  from './app/course/CloneCourse.jsx';
import StudentsXCourse  from './app/course/StudentsXCourse.jsx';
import Chat from './app/user/Chat.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/friends/search" element={<SearchUser />} />
        <Route path="/friends/list" element={<Friends />} />
        <Route path="/NewCourse" element={<NewCourse/>}/>
        <Route path="/See_Courses" element={<CourseList/>}/>
        <Route path="/courseViewMore/:id" element={<CourseViewMore/>}/>
        <Route path="/courseSection/:id" element={<CourseSection/>}/>
        <Route path="/CloneCourse/:id" element={<CloneCourse/>}/>
        <Route path="/my-courses/enrolled" element={<EnrolledIn_Courses/>}/>
        <Route path="/my-courses/created" element={<EnrolledIn_Courses/>}/>
        <Route path="/StudentsXCourse/:courseId" element={<StudentsXCourse/>}/>
        <Route path="/chat/:toId" element={<Chat />} />
      </Routes>
    </Router>
  );
}


export default App;