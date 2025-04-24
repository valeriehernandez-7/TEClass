import React, { useEffect, useState } from 'react';
import './StudentsXCourse.css';
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
  
const StudentsXCourse = ({ CourseId }) => {
  const [students, setStudents] = useState([]);
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
    const fetchStuddents = async () => {
      const res = await fetch(`http://localhost:4000/api/neo4j/getIdsEstudiantesMatriculados?courseId=${CourseId}`);
      const data = await res.json();
      setStudents(data);
    };
    fetchStuddents();
  }, [CourseId]);

  return (
    <div className="students-container">
      <h1>Estudiantes de un curso</h1>
      <div className="header-table">
        <div>Carnet</div>
        <div>Nombre</div>
      </div>
      {students.map((st, i) => (
        <div key={i} className="fila-estudiante">
          <div>{st.carne}</div>
          <div>{st.nombre}</div>
        </div>
      ))}
    </div>
  );
};

export default StudentsXCourse;