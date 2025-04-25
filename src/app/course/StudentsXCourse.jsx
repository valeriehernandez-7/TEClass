import React, { useEffect, useState, useContext } from 'react';
import './StudentsXCourse.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { View } from 'lucide-react';
import { UserContext } from '../../shared/UserSession';
import profile_icon from '../../assets/profile_photo.png';

const StudentsXCourse = () => {
  const { courseId } = useParams();  // Obtenemos el `courseId` de la URL
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const navigate = useNavigate();

  // Función para obtener los estudiantes matriculados en el curso desde Neo4j
  const fetchStudentsFromNeo4j = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/neo4j/getEstudiantesIds/${courseId}`);
      if (!res.ok) throw new Error('Failed to get students from Neo4j');
      
      const studentsData = await res.json();
      return studentsData;
    } catch (error) {
      console.error('Error fetching students from Neo4j:', error);
      return [];
    }
  };

  // Función para obtener los detalles de los estudiantes desde MongoDB
  const fetchStudentDetailsFromMongo = async (studentIds) => {
    try {
      console.log('IDs de estudiantes:', studentIds);
      const res = await fetch(`http://localhost:4000/api/mongo/getEstudiantesDetailsByIds/${studentIds.join(',')}`);
      if (!res.ok) throw new Error('Failed to get student details from MongoDB');
      
      const studentsData = await res.json();
      return studentsData;
    } catch (error) {
      console.error('Error fetching student details from MongoDB:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      // Primero, obtener los estudiantes del curso desde Neo4j
      const studentsData = await fetchStudentsFromNeo4j();
      
      // Obtener los IDs de los estudiantes
      const studentIds = studentsData.map((student) => student._id);
      
      if (studentIds.length > 0) {
        // Después, obtener los detalles completos de los estudiantes desde MongoDB
        const studentDetailsData = await fetchStudentDetailsFromMongo(studentIds);
        setStudentDetails(studentDetailsData);
      }
    };

    if (courseId) loadStudents();
  }, [courseId]);  // Dependencia para ejecutar cuando `courseId` cambie

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

      <div className="students-list-container">
        <h2>Estudiantes del Curso</h2>
        <div className="students-wrapper">
          <div className="students-dropdown">
            {studentDetails.length > 0 ? (
              studentDetails.map((student) => (
                <div className="student-card" key={student._id || student.username}>
                  <img src={student.avatar_url} alt="Avatar" className="student-avatar" />
                  <div className="student-info">
                    <p><strong>Nombre:</strong> {student.first_name} {student.last_name}</p>
                    <p><strong>Usuario:</strong> {student.username}</p>
                    <p><strong>Rol:</strong> {student.role}</p>
                  </div>
                  <div className="student-buttons">
                    <button onClick={() => navigate(`/studentProfile/${student._id}`)}>Ver Perfil</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No hay estudiantes matriculados en este curso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsXCourse;