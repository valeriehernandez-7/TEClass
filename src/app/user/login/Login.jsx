import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import user_icon from '../../../assets/person.png';
import password_icon from '../../../assets/password.png';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || 'Error al iniciar sesión');
        return;
      }

      const user = await response.json();

      toast.success(`Bienvenido, ${user.first_name || user.username}!`);

      if (user.role === 'professor') {
        //navigate('/admin/dashboard');
      } else {
        //navigate('/user/home');
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ocurrió un error al conectar con el servidor');
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Iniciar Sesión</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="icono usuario" />
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="icono contraseña" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="sign-up">
        ¿No tienes cuenta aún? <span>Registrate</span>
      </div>

      <div className="submit-container">
        <div className='submit' onClick={handleLogin}>Iniciar Sesión</div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
