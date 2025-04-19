import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../shared/Form.css';
import './Login.css';
import { UserContext } from '../../shared/UserSession.jsx';

import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';
import { Eye, EyeOff } from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Register from './Register.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  /* 
  This constants are used to set the initial state of the component.
  They are used to manage the state of the input fields and the visibility of the password.
  */

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  /* 
  This function is used to handle the login process.
  It sends a POST request to the server with the username and password.
  */

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
      toast.success(`Bienvenid@, ${user.first_name || user.username}!`);

      // Navigate to the appropriate menu.

      setUser(user);
      navigate('/menu');

      /*if (user.role === 'professor') {
        //navigate('/professorMenu');
      } else {
        //navigate('/studentMenu');
      }*/

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

        <div className="input password-input">
          <img src={password_icon} alt="icono contraseña" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="sign-up">
        ¿No tienes cuenta aún?{' '}
        <span onClick={() => navigate('/user')}>Registrate</span>
      </div>

      <div className="submit-container">
        <div className='submit' onClick={handleLogin}>Iniciar Sesión</div>
      </div>
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
