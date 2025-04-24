import React, { useEffect, useState, useContext } from 'react';
import './CoursesCreated.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../../shared/UserSession';

const menuItems = {
  'Cursos': [
    { label: 'Crear curso', path: '/NewCourse' },
    { label: 'Ver cursos', path: '/See_Courses' },
  ],
  'Mis Cursos': [
    { label: 'Cursos creados', path: '/my-courses/created', restrictedTo: 'professor' },
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

const CoursesCreated = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/neo4j/getCodigosCursosCreados?userId=${user.id}`);
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching created courses:', error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="menu-container">
      <ToastContainer />
      <header className="menu-header">
        <div className="tabs">
          {Object.keys(menuItems).map((tab) => (
            <div
              key={tab}
              className="tab"
              onClick={() => setActiveDropdown(activeDropdown === tab ? null : tab)}
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

      <div className="courses-container">
        <h2 className="titulo-principal">CURSOS CREADOS</h2>
        {courses.length === 0 ? (
          <div className="mensaje">No hay cursos para mostrar.</div>
        ) : (
          courses.map((course, i) => (
            <div key={i} className="fila">
              <div>{course.codigo}</div>
              <div>{course.nombre}</div>
              <div>{course.fecha}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CoursesCreated;
