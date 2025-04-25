import React, { useEffect, useState, useContext } from 'react';
import './see_courses.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { View } from 'lucide-react';
import { UserContext } from '../../shared/UserSession';

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

const SeeCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user } = useContext(UserContext);


  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/mongo/getAllCourses');
      
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        setFilteredCourses(data);
        setAllCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      const res = await fetch('http://localhost:4000/api/neo4j/EnrollCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: courseId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Curso matriculado con éxito!');
      } else {
        toast.error('Error al matricular el curso.');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Error al matricularse en el curso.');
    }
  };

  const handleOptionClick = (item) => {
    if (item.path === 'logout') {
      navigate('/');
    } else {
      navigate(item.path);
    }
    setActiveDropdown(null);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = () => {
    if (!searchCode.trim()) {
      setFilteredCourses(allCourses);
      return;
    }

    const filtered = allCourses.filter(course =>
      course.code.toLowerCase().includes(searchCode.toLowerCase())
    );

    setFilteredCourses(filtered);
  };

  const handleViewStudents = (courseId) => {
    navigate(`/StudentsXCourse/${courseId}`);
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

      <div className="course-list-container">
        <div className="search-area button">
          <button className="view-button" onClick={() => navigate(-1)}>
            <View className="view-icon" /> Volver
          </button>
        </div>

        <div className="search-area">
          <input
            type="text"
            placeholder="Buscar por código"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar</button>
        </div>

        <div className="courses-wrapper">
          <div className="course-dropdown">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div className="course-card" key={course._id || course.code}>
                  <img
                    src={course.image_url}
                    alt="Course"
                    className="course-image"
                  />
                  <div className="course-info">
                    <p><strong>Código:</strong> {course.code}</p>
                    <p><strong>Nombre:</strong> {course.name}</p>
                    <p><strong>Fecha de Inicio:</strong> {course.start_date}</p>
                    <p><strong>Fecha Final:</strong> {course.end_date}</p>
                  </div>
                  <div className="course-buttons">
                    <button onClick={() => handleEnrollCourse(course._id)}>Matricular Curso</button>
                    <button onClick={() => navigate(`/courseViewMore/${course._id}`)}>Ver más</button>
                    <button onClick={() => handleViewStudents(course._id)}>Ver Estudiantes</button> {/* Nuevo botón */}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No se encontraron cursos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeCourses;
