import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../app/user/Menu.css';
import './new_course.css';
import  defaultImagePath from '../../assets/course_default_img.png'; // Import the default image path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './section_course.css';
import menuItemsShared from '../../shared/menuitems.js';
import profile_icon from '../../assets/profile_photo.png';
import { UserContext } from '../../shared/UserSession';

const menuItems = menuItemsShared;

  const InsertSection = () => {
    const {id} = useParams()
     // Log the course object
    
     const { user } = useContext(UserContext);
    const [newSection, setNewSection] = useState('');
    const [resources, setResources] = useState(['', '']);
    const [newSubTitle, setNewSubTitle] = useState('');
    const [subResources, setSubResources] = useState(['']);
    const [sections, setSections] = useState([]);
    const [course, setCourse] = useState([]);
    
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [selectedSection, setSelectedSection] = useState('');
    const [newSubsection, setNewSubsection] = useState('');
    const [subResource, setSubResource] = useState('');
    const [sectionResources, setSectionResources] = useState('');
    const [newSectionTitle, setNewSectionTitle] = useState('');

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
            // Log the course ID being fetched
            const res = await fetch(`http://localhost:4000/api/mongo/getCourseById/${id}`);
            // Log the response object
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
      if (course.section) {
        setSections([course.section]);
        // Log the sections
      }
    }, [id]);
    
    const [status, setStatus] = useState(course.status);
   
    const handleUpdateStatus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/mongo/updateCourseStatus/${course._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
    
        if (response.ok) {
          const result = await response.json();
          toast.success('Estado del curso actualizado correctamente');
          setCourse((prev) => ({ ...prev, status }));
        } else {
          const errMsg = await response.text();
          toast.error(`Error al actualizar estado: ${errMsg}`);
        }
      } catch (error) {
        console.error('Error en handleUpdateStatus:', error);
        toast.error('Error de servidor al actualizar el estado');
      }
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
      
      // Send to backend logic here
    };
  
    const handleAddSubsection = () => {
     
      // Send to backend logic here
    };
    
    const handleAddSection = () => {
      // Send request to add section
    };
  
   
  
    const handleAddResourceToSection = () => {
      // Send request to add resource to section
    };
  
    const handleAddResourceToSubsection = () => {
      // Send request to add resource to subsection
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
  
              <div className="course-detail-container">
        <h2>{course.name}</h2>
        <p><strong>Código:</strong> {course.code}</p>
        <p><strong>Estado:</strong> {course.status}</p>
        <p><strong>Inicio:</strong> {new Date(course.start_date).toLocaleDateString()}</p>
        <p><strong>Fin:</strong> {new Date(course.end_date).toLocaleDateString()}</p>

        <div className="form-group">
          <label htmlFor="status">Actualizar estado del curso</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="editing">Editing</option>
            <option value="published">Published</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={handleUpdateStatus}>Actualizar estado</button>
        </div>

        <div className="form-group">
          <label htmlFor="section-title">Agregar nueva sección</label>
          <input
            type="text"
            placeholder="Título de la sección"
            value={newSectionTitle}
            onChange={e => setNewSectionTitle(e.target.value)}
          />
          <button onClick={handleAddSection}>Agregar sección</button>
        </div>

        <div className="form-group">
          <label>Agregar subsección a sección existente</label>
          <select onChange={e => setSelectedSection(e.target.value)} value={selectedSection}>
            <option value="">Selecciona una sección</option>
            {sections.map((section, idx) => (
              <option key={idx} value={section.section_title}>{section.section_title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Título de la subsección"
            value={newSubsection}
            onChange={e => setNewSubsection(e.target.value)}
          />
          <button onClick={handleAddSubsection}>Agregar subsección</button>
        </div>

        <div className="form-group">
          <label>Agregar recurso a sección</label>
          <select onChange={e => setSelectedSection(e.target.value)} value={selectedSection}>
            <option value="">Selecciona una sección</option>
            {sections.map((section, idx) => (
              <option key={idx} value={section.section_title}>{section.section_title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Recurso para sección"
            value={sectionResources}
            onChange={e => setSectionResources(e.target.value)}
          />
          <button onClick={handleAddResourceToSection}>Agregar recurso</button>
        </div>

        <div className="form-group">
          <label>Agregar recurso a subsección</label>
          <select onChange={e => setSelectedSection(e.target.value)} value={selectedSection}>
            <option value="">Selecciona una sección</option>
            {sections.map((section, idx) => (
              <option key={idx} value={section.section_title}>{section.section_title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Recurso para subsección"
            value={subResource}
            onChange={e => setSubResource(e.target.value)}
          />
          <button onClick={handleAddResourceToSubsection}>Agregar recurso a subsección</button>
        </div>
        </div>
      </div>
    );
  };
  
  export default InsertSection;