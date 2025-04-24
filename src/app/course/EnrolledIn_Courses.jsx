import React, { useEffect, useState } from 'react';
import './EnrolledIn_Courses.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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

const EnrolledIn_Courses = () => {
  const [courses, setCourses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/neo4j/getCodigosCursosMatriculados?userId=${user.id}`);
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        toast.error('Error al obtener los cursos.');
      }
    };
    fetchCourses();
  }, [user.id]);

  const handleOptionClick = (item) => {
    if (item.path === 'logout') {
      localStorage.removeItem('user');
      navigate('/');
    } else {
      navigate(item.path);
    }
    setActiveDropdown(null);
  };

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

      <div className="main-container">
        <h1 className="titulo">Mis Cursos</h1>

          <div className="encabezado">
            <div>Código de curso</div>
            <div>Nombre del curso</div>
            <div>Fecha de inicio</div>
          </div>

          {courses.length === 0 ? (
            <p className="mensaje">No hay cursos para mostrar.</p>
          ) : (
            courses.map((curso, index) => (
              <div className="fila" key={index}>
                <div>{curso.codigo}</div>
                <div>{curso.nombre}</div>
                <div>{curso.fecha}</div>
              </div>
            ))
          )}
        </div>
      </div>
  );
};

export default EnrolledIn_Courses;
