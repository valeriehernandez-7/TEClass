import React, { useEffect, useState } from 'react';
import './see_courses.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { View } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './CourseViewMore.css';
const menuItems = {
  'Cursos': [
    { label: 'Crear curso', path: '/NewCourse' },
    { label: 'Ver cursos', path: '/See_Courses' },
  ],
  'Mis Cursos': [
    { label: 'Cursos matriculados', path: '/my-courses/enrolled' },
    { label: 'Matricular cursos', path: '/my-courses/enroll' },
  ],
  'Amigos': [
    { label: 'Buscar usuario', path: '/friends/search' },
    { label: 'Ver amigos', path: '/friends/list' },
  ],
  'Evaluaciones': [
    { label: 'Ver Evaluaciones', path: '/evaluations' }
  ],
  'Perfil': [
    { label: 'Editar perfil', path: '/profile/edit' },
    { label: 'Cerrar sesión', path: 'logout' },
  ],
};

const ViewMore = () => {
    const {id} = useParams();
    const [course, setCourse] = useState({});
    console.log( 'Course ID:', id); // Log the course ID
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();


    const handleOptionClick = (item) => {
        if (item.path === 'logout') {
          
          navigate('/');
        } else {
          navigate(item.path);
        }
        setActiveDropdown(null);
      };

    const fetchCourse = async () => {
        try {
            console.log('Fetching course with ID:', id); // Log the course ID being fetched
            const res = await fetch(`http://localhost:4000/api/getCourseById/${id}`);
            console.log('Response:', res); // Log the response object
            if (res.ok) {
                const data = await res.json();
                setCourse(data);
            } else {
                console.error('Error fetching course:', res.statusText);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    if (!course) return <div>Loading...</div>;


    return (
        <div className="menu-container">
        
            <ToastContainer />
                      <header className="menu-header">
                      <div className="tabs">
                          {Object.keys(menuItems).map((tab) => (
                            <div
                              key={tab}
                              className="tab"
                              onClick={() =>
                                setActiveDropdown(activeDropdown === tab ? null : tab)
                              }
                            >
                              {tab}
                              {activeDropdown === tab && (
                                <div className="dropdown">
                                  {menuItems[tab].map((item) => (
                                    <div
                                      key={item.label}
                                      className="dropdown-item"
                                      onClick={() => handleOptionClick(item)}
                                    >
                                      {item.label}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="user-info">
                          <img
                            className="avatar"
                            src="https://via.placeholder.com/45"
                            alt="User Avatar"
                            title="Perfil"
                          />
                        </div>
                      </header>
    <div className="page-wrapper">
      <h2>{course.name}</h2>
      <p><strong>Código:</strong> {course.code}</p>
      <p><strong>Descripción:</strong> {course.description}</p>
      <p><strong>Estado:</strong> {course.status}</p>
      <p><strong>Inicio:</strong> {new Date(course.start_date).toLocaleDateString()}</p>
      <p><strong>Fin:</strong> {new Date(course.end_date).toLocaleDateString()}</p>
      {course.image_url && <img src={course.image_url} alt="Course" className="course-detail-image" />}

      {course.section && (
        <div className="course-section">
          <h3>Sección: {course.section.section_title}</h3>
          <ul>
            {course.section.resources?.map((res, idx) => (
              <li key={idx}>{res}</li>
            ))}
          </ul>

          {course.section.sub_section && (
            <div className="sub-section">
              <h4>Sub-sección: {course.section.sub_section.sub_title}</h4>
              <ul>
                {course.section.sub_section.sub_resources?.map((subRes, idx) => (
                  <li key={idx}>{subRes}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
      );
};


export default ViewMore;