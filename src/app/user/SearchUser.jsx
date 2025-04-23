import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContext } from 'react';
import { UserContext } from '../../shared/UserSession';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../shared/Form.css';
import './SearchUser.css';

import profile_icon from '../../assets/profile_photo.png';
import friend_request from '../../assets/friend_request.png';
import send_message from '../../assets/send_message.png';

const SearchUser = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/mongo/all-users?currentUserId=${user.id}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
        setSearchResult(null);
      } else {
        console.warn('Respuesta inesperada:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error al obtener los usuarios:', err);
      setUsers([]);
    }
  };  

  const getByUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:4000/api/mongo/by-username/${username}`);
      if (response.ok) {
        const user = await response.json();
        setSearchResult(user);
      } else {
        setSearchResult([]);
      }
    } catch (err) {
      console.error('Error al buscar usuario:', err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() === '') {
      fetchAllUsers();
    } else {
      getByUsername(searchInput.trim());
    }
  };

  const handleAddFriend = async (toUserId) => {
    if (!user) {
      toast.warn('Debes iniciar sesión para agregar amigos');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/neo4j/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromId: user.id,
          toId: toUserId
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || 'Solicitud de amistad enviada');
      } else if (response.status === 409) {
        toast.info(result.message);
      } else {
        toast.error(result.message || 'No se pudo enviar la solicitud');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      toast.error('Error de conexión con el servidor');
    }
  };      

  const handleMessage = (username) => {
    navigate('/chat');
  };

  const renderUser = (user) => (
    <div className="sch-user-row" key={user._id}>
      <img
        src={user.avatar_url || profile_icon}
        alt="avatar"
        className="sch-user-avatar"
      />
      <div className="sch-user-username">{user.username}</div>
      <div className="sch-user-name">{user.first_name} {user.last_name}</div>
      <div className="sch-user-action sch-add-action">
        <img
          src={friend_request}
          alt="Agregar amigo"
          className="sch-action-icon"
          onClick={() => handleAddFriend(user._id)}
        />
      </div>
      <div className="sch-user-action sch-message-action">
        <img
          src={send_message}
          alt="Enviar mensaje"
          className="sch-action-icon"
          onClick={() => handleMessage(user._id)}
        />
      </div>
    </div>
  );

  return (
    <div className="sch-main-wrapper">
      <div className="sch-container">
        <div className="header sch-header-compact">
          <div className="text">Buscar Usuario</div>
          <div className="underline"></div>
        </div>

        <form onSubmit={handleSearch} className="sch-search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre de usuario..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sch-search-input"
          />
          <button type="submit" className="sch-search-button">Buscar</button>
        </form>

        <div className="sch-user-list">
          <div className="sch-user-header-row">
            <div className="sch-user-avatar-header"></div>
            <div className="sch-user-username"><strong>Usuario</strong></div>
            <div className="sch-user-name"><strong>Nombre</strong></div>
            <div className="sch-user-action sch-add-action"><strong>Agregar</strong></div>
            <div className="sch-user-action sch-message-action"><strong>Mensaje</strong></div>
          </div>

          {searchResult
            ? (Array.isArray(searchResult)
                ? <div>No se encontró el usuario.</div>
                : renderUser(searchResult))
            : (users.length > 0
                ? users.map((user) => renderUser(user))
                : <div>No hay usuarios para mostrar.</div>)}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SearchUser;
