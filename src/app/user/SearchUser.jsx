import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/all-users');
      const data = await response.json();
      setUsers(data);
      setSearchResult(null);
    } catch (err) {
      console.error('Error al obtener los usuarios:', err);
    }
  };

  const getByUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:4000/api/by-username/${username}`);
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

  const handleAddFriend = (username) => {
    console.log(`Agregar amigo: ${username}`);
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
          onClick={() => handleAddFriend(user.username)}
        />
      </div>
      <div className="sch-user-action sch-message-action">
        <img
          src={send_message}
          alt="Enviar mensaje"
          className="sch-action-icon"
          onClick={() => handleMessage(user.username)}
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
            : users.map((user) => renderUser(user))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
