import React, { useEffect, useState, useContext } from 'react';
import './EnrolledIn_Courses.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { View } from 'lucide-react';
import { UserContext } from '../../shared/UserSession';
import menuItemsShared from '../../shared/menuitems.js';
import profile_icon from '../../assets/profile_photo.png';

const SeeEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchEnrolledCourseIds = async () => {
    try {
      
      const res = await fetch(`http://localhost:4000/api/neo4j/getCodigosCursosMatriculados/${user.id}`);
      if (!res.ok) throw new Error('Failed to get enrolled course IDs from Neo4j');
       // Log the response object
    
      const  courseIds  = await res.json(); // Expecting { courseIds: ["abc123", "def456"] }
     // Log the fetched course IDs
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
      console.log('Fetched courses:', data); // Log the response object
       // Log the fetched courses
      return data;
    } catch (error) {
      console.error('Error fetching courses from MongoDB:', error);
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      const courseIds = await fetchEnrolledCourseIds();
      if (courseIds.length > 0) {
        const courses = await fetchCoursesFromMongo(courseIds);
        setEnrolledCourses(courses);
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
          <img
            src={user?.avatar_url || profile_icon}
            alt="avatar"
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = profile_icon;
            }}
          />
        </div>
      </header>

      <div className="course-list-container">
        <h2>Cursos Matriculados</h2>
        <div className="courses-wrapper">
          <div className="course-dropdown">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((data) => (
                <div className="course-card" key={data._id || data.code}>
                  <img src={data.image_url} alt="Course" className="course-image" />
                  <div className="course-info">
                    <p><strong>Código:</strong> {data.code}</p>
                    <p><strong>Nombre:</strong> {data.name}</p>
                    <p><strong>Fecha de Inicio:</strong> {data.start_date}</p>
                    <p><strong>Fecha Final:</strong> {data.end_date}</p>
                  </div>
                  <div className="course-buttons">
                    <button onClick={() => navigate(`/courseViewMore/${data._id}`)}>Ver más</button>
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