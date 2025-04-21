import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../shared/Form.css';
import './Menu.css';


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

const Menu = () => {
  const { user, clearUser } = '';
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleOptionClick = (item) => {
    if (item.path === 'logout') {
      clearUser();
      navigate('/');
    } else {
      navigate(item.path);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
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
            src={user?.avatar_url}
            alt="avatar"
            className="avatar"
            onError={(e) => {
                e.target.onerror = null;
            
            }}
        />
        </div>
      </div>

      <div className="welcome">
        <h2>Bienvenid@, {user?.first_name || user?.username}</h2>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
    </div>
  );
};

export default Menu;
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../shared/Form.css';
import './Menu.css';


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

const Menu = () => {
  const { user, clearUser } = '';;
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleOptionClick = (item) => {
    if (item.path === 'logout') {
      clearUser();
      navigate('/');
    } else {
      navigate(item.path);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
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
            src={user?.avatar_url}
            alt="avatar"
            className="avatar"
            onError={(e) => {
                e.target.onerror = null;
            
            }}
        />
        </div>
      </div>

      <div className="welcome">
        <h2>Bienvenid@, {user?.first_name || user?.username}</h2>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
    </div>
  );
};

export default Menu;