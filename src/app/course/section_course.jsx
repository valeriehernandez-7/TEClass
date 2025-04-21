import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../app/user/Menu.css';
import './new_course.css';
import  defaultImagePath from '../../assets/course_default_img.png'; // Import the default image path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './section_course.css';



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

  const InsertSection = () => {
    const {id} = useParams()
    console.log(id) // Log the course object
    
    const [newSection, setNewSection] = useState('');
    const [resources, setResources] = useState(['', '']);
    const [newSubTitle, setNewSubTitle] = useState('');
    const [subResources, setSubResources] = useState(['']);
    const [sections, setSections] = useState([]);
    const [course, setCourse] = useState({});
    const [selectedSection, setSelectedSection] = useState('');
    const [newSubInput, setNewSubInput] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { user, clearUser } = '';
    const navigate = useNavigate();
  
    const handleOptionClick = (item) => {
        if (item.path === 'logout') {
          clearUser();
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
                console.log('Course data:', course);
            } else {
                console.error('Error fetching course:', res.statusText);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    

    useEffect(() => {
        fetchCourse();
      if (course.section) {
        setSections([course.section]);
      }
    }, [id]);
    
    const [status, setStatus] = useState(course.status);

    const handleUpdateStatus = () => {
      console.log('Updating status to:', status);
      // Send to backend logic here
    };
  
    const updateResource = (index, event) => {
      const updated = [...resources];
      updated[index] = event.target.value;
      setResources(updated);
    };
  
    const updateSubResource = (index, event) => {
      const updated = [...subResources];
      updated[index] = event.target.value;
      setSubResources(updated);
    };
  
    const handleUploadSection = () => {
      const sectionData = {
        section_title: newSection,
        resources: resources.filter(Boolean),
        sub_section: {
          sub_title: newSubTitle,
          sub_resources: subResources.filter(Boolean)
        }
      };
      console.log('Uploading section:', sectionData);
      // Send to backend logic here
    };
  
    const handleAddSubsection = () => {
      console.log(`Adding subsection "${newSubInput}" to section "${selectedSection}"`);
      // Send to backend logic here
    };
  
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  
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
  
        <div className="course-form-container">
          <h2>Editar Curso</h2>
  
          <div className="course-info-block">
            <p><strong>Código:</strong> {course.code}</p>
            <p><strong>Nombre:</strong> {course.name}</p>
            <p><strong>Estado:</strong>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="editing">Editing</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={handleUpdateStatus}>Actualizar Estado</button>
            </p>
            <p><strong>Inicio:</strong> {formatDate(course.start_date)}</p>
            <p><strong>Fin:</strong> {formatDate(course.end_date)}</p>
          </div>
  
          <div className="section-form">
            <h3>Agregar Nueva Sección</h3>
            <input type="text" placeholder="Título de la sección" value={newSection} onChange={(e) => setNewSection(e.target.value)} />
            <input type="text" placeholder="Recurso 1" onChange={(e) => updateResource(0, e)} />
            <input type="text" placeholder="Recurso 2" onChange={(e) => updateResource(1, e)} />
            <input type="text" placeholder="Subtítulo subsección" value={newSubTitle} onChange={(e) => setNewSubTitle(e.target.value)} />
            <input type="text" placeholder="Sub-recurso 1" onChange={(e) => updateSubResource(0, e)} />
            <button onClick={handleUploadSection}>Subir Sección</button>
          </div>
  
          <div className="subsection-form">
            <h3>Agregar Subsección a Sección Existente</h3>
            <select onChange={(e) => setSelectedSection(e.target.value)}>
              <option value="">Selecciona una sección</option>
              {sections.map((sec, idx) => (
                <option key={idx} value={sec.section_title}>{sec.section_title}</option>
              ))}
            </select>
            <input type="text" placeholder="Nueva subsección" value={newSubInput} onChange={(e) => setNewSubInput(e.target.value)} />
            <button onClick={handleAddSubsection}>Agregar Subsección</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default InsertSection;