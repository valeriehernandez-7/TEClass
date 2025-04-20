import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../shared/Form.css';
import '../../app/user/Menu.css';
import './new_course.css';
import  defaultImagePath from '../../assets/course_default_img.png'; // Import the default image path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewCourse = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
   // relative to public folder
  const [imagePreview, setImagePreview] = useState(defaultImagePath);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    ImageUrl: null,
    start_date: '',
    end_date: '',
    status: '',
    section: {},
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, ImageUrl: file });
    }
  };

  const handleNewCourse = async (e) => {
    e.preventDefault(); // Prevent form reload

    const { code, name, description, ImageUrl, start_date, end_date, status, section } = formData;

    if (!code || !name || !description || !start_date || !end_date || !status) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    let image_url;

    if (formData.ImageUrl) {
      image_url = URL.createObjectURL(formData.ImageUrl);
      } else {
        image_url = '/assets/course_default_img.png'; // Default image path
    }

    const CourseToSend = {
      code,
      name,
      description,
      image_url,
      start_date,
      end_date,
      status,
      section,
    };

    try {
      const response = await fetch('http://localhost:4000/api/NewCourse', {
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
      navigate('/');
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
          <div className="tab" onClick={() => setShowDropdown(!showDropdown)}>
            Opciones ▾
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdown-item">Item 1</div>
                <div className="dropdown-item">Item 2</div>
                <div className="dropdown-item">Item 3</div>
              </div>
            )}
          </div>
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

            <label>
              Estado:
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="">-- Seleccionar --</option>
                <option value="editing">editing</option>
                <option value="published">published</option>
                <option value="active">active</option>
                <option value="closed">closed</option>
              </select>
            </label>

            <button type="submit">Guardar</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewCourse;