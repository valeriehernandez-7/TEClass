import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../shared/Form.css';
import '../../app/user/Menu.css';
import './CloneCourse.css';
import defaultImagePath from '../../assets/course_default_img.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import menuItemsShared from '../../shared/menuitems.js';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const menuItems = menuItemsShared;

const CloneCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultImagePath);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/mongo/getCourseById/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
          setFormData({
            code: '',
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            status: 'editing',
            section: data.section || [],
            ImageUrl: null
          });
            setImagePreview(defaultImagePath);
        } else {
          toast.error('No se pudo obtener el curso.');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al conectar con el servidor');
      }
    };

    fetchCourse();
  }, [id]);

  const handleOptionClick = (item) => {
    if (item.path === 'logout') {
      navigate('/');
    } else {
      navigate(item.path);
    }
    setActiveDropdown(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('El archivo es demasiado grande. Máximo 10MB.');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error('Solo se permiten imágenes JPG o PNG.');
        return;
      }
      setFormData({ ...formData, ImageUrl: file });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewCourse = async (e) => {
    e.preventDefault();
    const { code, name, description, start_date, end_date, section } = formData;

    if (!code || !name || !description || !start_date) {
      toast.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    let image_url;

    if (formData.ImageUrl) {
      image_url = await toBase64(formData.ImageUrl);
    } else if (course?.image_url) {
      image_url = course.image_url;
    } else {
      const response = await fetch(defaultImagePath);
      const blob = await response.blob();
      image_url = await toBase64(blob);
    }

    const CourseToSend = {
      code,
      name,
      description,
      start_date,
      end_date,
      image_url,
      section,
      status: 'editing'
    };

    try {
      const response = await fetch('http://localhost:4000/api/mongo/NewCourse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CourseToSend),
      });

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || 'Error al insertar curso.');
        return;
      }

      toast.success('Curso clonado correctamente!');
      navigate('/menu');
    } catch (error) {
      console.error('Error al clonar curso:', error);
      toast.error('Ocurrió un error al conectar con el servidor');
    }
  };

  if (!formData) return <div>Cargando...</div>;

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
            alt="Avatar"
            title="Perfil"
          />
        </div>
      </header>

      <main className="welcome">
        <h2>Clonar Curso</h2>
        <div className="form-layout">
          <div className="image-upload">
            <div className="image-preview">
              {imagePreview ? <img src={imagePreview} alt="Preview" /> : <span>Vista previa</span>}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <form className="course-form" onSubmit={handleNewCourse}>
            <label>
              Código:
              <input type="text" name="code" value={formData.code} onChange={handleChange} />
            </label>

            <label>
              Nombre:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>

            <label>
              Descripción:
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
            </label>

            <label>
              Fecha de inicio:
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
            </label>

            <label>
              Fecha de finalización:
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
            </label>

            <button type="submit">Clonar</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CloneCourse;