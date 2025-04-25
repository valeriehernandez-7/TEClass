import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentsXCourse.css';
import { ToastContainer, toast } from 'react-toastify';

const StudentsXCourse = () => {
  const { courseId } = useParams();  
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Petición al backend para obtener los estudiantes matriculados en el curso
        const res = await fetch(`http://localhost:4000/api/neo4j/getEstudiantesDetails/${courseId}`);
        
        if (res.ok) {
          const data = await res.json();
          setStudents(data); // Setea la lista de estudiantes en el estado
        } else {
          toast.error('Error al obtener los estudiantes');
        }
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        toast.error('Hubo un problema al obtener los estudiantes');
      }
    };

    fetchStudents();  // Llamada al backend al cargar el componente
  }, [courseId]);  // La dependencia es `courseId`, se recarga cuando cambia

  return (
    <div className="students-container">
      <ToastContainer />
      <h1>Estudiantes del curso</h1>
      <div className="header-table">
        <div>Nombre de Usuario</div>
        <div>Primer nombre</div>
        <div>Segundo nombre</div>
        <div>Avatar</div>
        <div>Rol</div>
      </div>
      {students.length > 0 ? (
        students.map((student, i) => (
          <div key={i} className="fila-estudiante">
            <div>{student.username}</div>
            <div>{student.first_name}</div>
            <div>{student.last_name}</div>
            <div><img src={student.avatar_url} alt="Avatar" className="avatar-img" /></div>
            <div>{student.role}</div>
          </div>
        ))
      ) : (
        <p>No hay estudiantes matriculados en este curso.</p>
      )}
    </div>
  );
};

export default StudentsXCourse;
