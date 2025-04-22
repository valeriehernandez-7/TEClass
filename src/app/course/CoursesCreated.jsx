import React, { useEffect, useState } from 'react';
import './CoursesCreated.css';
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

const CoursesCreated = () => {
  const [courses, setCourses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
      const res = await fetch('http://localhost:4000/api/neo4j/funcion para hacer lo que sea'); //Aqui se cambia
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    <div className="courses-container">
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
  );
};

export default CoursesCreated;