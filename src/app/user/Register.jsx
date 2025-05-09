import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import '../../shared/Form.css';
import './Register.css';
import profile_icon from '../../assets/profile_photo.png';
import { isPasswordValid } from '../../middlewares/passwordValidator.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Eye, EyeOff } from 'lucide-react';

/* Manage the file upload by the user */

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const Register = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    role: '',
    profilePicture: null,
  });

  /* 
  This handler is used to set the state of the component when it changes.
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* 
  This handler is used to set the state of the image component when it changes.
  */

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
  

  /* 
  This handler is used to let the user select a file.
  */

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  /* 
  This handler verifies if all the spaces from the registration page are filled.
  */

  const handleRegister = async () => {
    const { username, password, firstName, lastName, birthDate, role, profilePicture } = formData;
  
    if (!username || !password || !firstName || !lastName || !birthDate || !role) {
      toast.error('Por favor, complete todos los campos');
      return;
    }
  
    if (!isPasswordValid(password)) {
      toast.error(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
      );
      return;
    }
  
    let avatarUrl = profile_icon;
  
    if (profilePicture) {
      try {
        avatarUrl = await toBase64(profilePicture);
      } catch (error) {
        console.error('Error al convertir la imagen:', error);
        toast.error('No se pudo procesar la imagen');
        return;
      }
    }

    const userToSend = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      avatar_url: avatarUrl,
      role,
    };
  
    try {
      const response = await fetch('http://localhost:4000/api/mongo/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToSend),
      });
  
      if (!response.ok) {
        const message = await response.text();
        toast.error(message || 'Error al registrar');
        return;
      }
  
      toast.success('Registro exitoso');
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Ocurrió un error al conectar con el servidor');
    }
  };
  

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-header">
          <div className="text">Registrarse</div>
          <div className="underline"></div>
        </div>

        <input
          className="register-input"
          type="text"
          name="username"
          placeholder="Nombre de Usuario"
          value={formData.username}
          onChange={handleChange}
        />

        <div className="password-wrapper">
          <input
            className="register-input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
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
        <input
          className="register-input"
          type="date"
          name="birthDate"
          placeholder="Fecha de Nacimiento"
          value={formData.birthDate}
          onChange={handleChange}
        />
        <select
          className="register-input"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Seleccionar Rol</option>
          <option value="student">Estudiante</option>
          <option value="professor">Profesor</option>
        </select>

        <div className="register-button-container">
          <div className="register-button" onClick={handleRegister}>
            Registrar
          </div>
        </div>
      </div>

      <div className="register-photo-section">
        <div className="register-photo-label">Foto de perfil</div>
        <div className="register-photo-preview">
          <img
            src={
              formData.profilePicture
                ? URL.createObjectURL(formData.profilePicture)
                : profile_icon
            }
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

export default Register;
