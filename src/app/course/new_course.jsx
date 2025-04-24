import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../shared/Form.css';
import '../../app/user/Menu.css';
import './new_course.css';
import { UserContext } from '../../shared/UserSession';
import  defaultImagePath from '../../assets/course_default_img.png'; // Import the default image path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

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

const NewCourse = () => {
  const navigate = useNavigate();
  const { user1, clearUser } = '';

  const { user } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
   // relative to public folder
  const [imagePreview, setImagePreview] = useState(defaultImagePath);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    ImageUrl: null,
    start_date: '',
    end_date: null,
    status: '',
    section: {},
  });


    
  const handleOptionClick = (item) => {
    if (item.path === 'logout') {
      clearUser();
      navigate('/');
    } else {
      navigate(item.path);
    }
    setActiveDropdown(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error('Solo se permiten imágenes en formato JPG o PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, ImageUrl: file });
    }
  };


  const handleNewCourse = async (e) => {
    e.preventDefault(); // Prevent form reload

    const { code, name, description, start_date, end_date, section } = formData;

    if (!code || !name || !description || !start_date ) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    
    let image_url;



    if (formData.ImageUrl) {
      image_url = await toBase64(formData.ImageUrl);
    } else {
      // Fetch the default image and convert to base64
      const response = await fetch(defaultImagePath);
      const blob = await response.blob();
      image_url = await toBase64(blob);
    }
    const CourseToSend = {
      code,
      name,
      description,
      image_url,
      start_date,
      end_date,
      status : "editing",
      section,
    };

    try {
      const response = await fetch('http://localhost:4000/api/mongo/NewCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(CourseToSend),
      });

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || 'Error al insertar curso.');
        return;
      }

      toast.success('Curso Insertado!');
      const course = await fetch(`http://localhost:4000/api/mongo/getCourseByCode/${code}`);
      if (!course.ok) {
        const message = await course.text();
        toast.error(message || 'Error al obtener el curso.');
        return;
      } else {
        const data = await course.json();
         // Log the fetched course data
        const responseRELATION = await fetch('http://localhost:4000/api/neo4j/createCourseRelation', {
      
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },  
          body: JSON.stringify({
            userId: user.id,
            courseId: data._id,
          }),
        });
        if (!responseRELATION.ok) {
          const message = await responseRELATION.text();
          toast.error(message || 'Error al crear la relación del curso.');
          return;
        } else {
          toast.success('Relación creada con éxito!');
        }
      }


    } catch (error) {
      console.error('Register error:', error);
      toast.error('Ocurrió un error al conectar con el servidor');
    }
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

      <main className="welcome">
        <h2>Insertar Curso</h2>
        <div className="form-layout">
          <div className="image-upload">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <span>Vista previa</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <form className="course-form" onSubmit={handleNewCourse}>
            <label>
              Código:
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </label>

            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </label>

            <label>
              Descripción:
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </label>

            <label>
              Fecha de inicio:
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </label>

            <label>
              Fecha de finalización:
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </label>

            

            <button type="submit">Guardar</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewCourse;