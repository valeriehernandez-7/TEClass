import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../shared/Form.css';

import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    role: '',
    avatar_url: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    const { username, password, first_name, last_name, birth_date, role } = form;
    return username && password && first_name && last_name && birth_date && role;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.warning('Por favor, completa todos los campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();

      if (response.ok) {
        toast.success('¡Registro exitoso!');
        setTimeout(() => {
          navigate('/user/login');
        }, 2000);
      } else {
        toast.error(result || 'Error al registrarse');
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Ocurrió un error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Registro</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="icono usuario" />
          <input
            type="text"
            name="username"
            placeholder="Nombre de Usuario"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="icono contraseña" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <img src={user_icon} alt="icono nombre" />
          <input
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <img src={user_icon} alt="icono apellido" />
          <input
            type="text"
            name="last_name"
            placeholder="Apellido"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <img src={user_icon} alt="icono fecha" />
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <img src={user_icon} alt="icono rol" />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{
              height: '50px',
              width: '400px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '19px',
              appearance: 'none',
            }}
          >
            <option value="" disabled>Selecciona un rol</option>
            <option value="student">Estudiante</option>
            <option value="professor">Profesor</option>
          </select>
        </div>

        <div className="input">
          <img src={user_icon} alt="icono avatar" />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="submit-container">
        <div className='submit' onClick={handleRegister}>
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
