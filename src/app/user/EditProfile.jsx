import React, { useContext, useState, useRef } from 'react';
import { UserContext } from '../../shared/UserSession.jsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';

import '../../shared/Form.css';
import './EditProfile.css';
import profile_icon from '../../assets/profile_photo.png';
import { isPasswordValid } from '../../middlewares/passwordValidator.js';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    password: '',
    birthDate: user?.birth_date? new Date(user.birth_date).toISOString().split('T')[0]: '',
    avatarUrl: user?.avatar_url || '',
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
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
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, password, birthDate, avatarUrl, profilePicture } = formData;
    if (!firstName || !lastName || !birthDate) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (password){
      if (!isPasswordValid(password)) {
        toast.error(
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
        );
        return;
      }
    }

    let finalAvatarUrl = avatarUrl;
    if (profilePicture) {
      try {
        finalAvatarUrl = await toBase64(profilePicture);
      } catch (error) {
        console.error('Error al convertir la imagen:', error);
        toast.error('No se pudo procesar la imagen');
        return;
      }
    }

    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      password,
      birth_date: birthDate,
      avatar_url: finalAvatarUrl,
    };
    try {
      const response = await fetch(`http://localhost:4000/api/update/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || 'Error al actualizar el perfil');
        return;
      }

      setUser({ ...user, ...updatedUser });
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));

      toast.success('Perfil actualizado correctamente');
      navigate('/menu');

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Ocurrió un error al conectar con el servidor');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-header">
          <div className="text">Editar Perfil</div>
          <div className="underline"></div>
        </div>

        <input
          className="register-input"
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          className="register-input"
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
        />
        <div className="password-wrapper">
          <input
            className="register-input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Nueva Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <input
          className="register-input"
          type="date"
          name="birthDate"
          placeholder="Fecha de Nacimiento"
          value={formData.birthDate}
          onChange={handleChange}
        />

        <div className="register-button-container">
          <div className="register-button" onClick={handleSubmit}>
            Guardar Cambios
          </div>
        </div>
      </div>

      <div className="register-photo-section">
        <div className="register-photo-label">Foto de perfil</div>
        <div className="register-photo-preview">
          <img
            src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : formData.avatarUrl || profile_icon}
            alt="Foto de perfil"
            className="profile-img"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditProfile;
