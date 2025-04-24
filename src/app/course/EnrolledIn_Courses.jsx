import React, { useEffect, useState, useContext } from 'react';
import './see_courses.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { View } from 'lucide-react';
import { UserContext } from '../../shared/UserSession';

const SeeEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchEnrolledCourseIds = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/neo4j/getCodigosCursosMatriculados/${user.id}`);
      if (!res.ok) throw new Error('Failed to get enrolled course IDs from Neo4j');
    
      const  courseIds  = await res.json(); // Expecting { courseIds: ["abc123", "def456"] }
      return courseIds;
    } catch (error) {
      console.error('Error fetching enrolled course IDs:', error);
      return [];
    }
  };

  const fetchCoursesFromMongo = async (courseIds) => {
    try {
      const response = await fetch(`http://localhost:4000/api/mongo/getCoursesByIds/${courseIds.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses from MongoDB');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching courses from MongoDB:', error);
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      const courseIds = await fetchEnrolledCourseIds();
      if (courseIds.length > 0) {
        await fetchCoursesFromMongo(courseIds);
      }
    };

    if (user?.id) loadCourses();
  }, [user]);

  return (
    <div className="menu-container">
      <ToastContainer />
      <header className="menu-header">
        <div className="tabs">
          <div className="tab" onClick={() => navigate(-1)}>
            <View className="view-icon" /> Volver
          </div>
        </div>
        <div className="user-info">
          <img className="avatar" src="https://via.placeholder.com/45" alt="User Avatar" title="Perfil" />
        </div>
      </header>

      <div className="course-list-container">
        <h2>Cursos Matriculados</h2>
        <div className="courses-wrapper">
          <div className="course-dropdown">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div className="course-card" key={course._id || course.code}>
                  <img src={course.image_url} alt="Course" className="course-image" />
                  <div className="course-info">
                    <p><strong>Código:</strong> {course.code}</p>
                    <p><strong>Nombre:</strong> {course.name}</p>
                    <p><strong>Fecha de Inicio:</strong> {course.start_date}</p>
                    <p><strong>Fecha Final:</strong> {course.end_date}</p>
                  </div>
                  <div className="course-buttons">
                    <button onClick={() => navigate(`/courseViewMore/${course._id}`)}>Ver más</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No estás matriculado en ningún curso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeEnrolledCourses;