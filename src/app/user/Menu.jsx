import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../shared/UserSession.jsx';
import '../../shared/Form.css';
import './Menu.css';
import profile_icon from '../../assets/profile_photo.png';

const menuItems = {
  'Cursos': [
    { label: 'Crear curso', path: '/courses/create' },
    { label: 'Seccionar curso', path: '/courses/section' },
    { label: 'Ver cursos', path: '/courses/view' },
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
  const { user, clearUser } = useContext(UserContext);
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
            src={user?.avatar_url || profile_icon}
            alt="avatar"
            className="avatar"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = profile_icon;
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
