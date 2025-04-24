import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserContext } from '../../shared/UserSession';
import '../../shared/Form.css';
import './Friends.css';

import profile_icon from '../../assets/profile_photo.png';
import send_message from '../../assets/send_message.png';
import accept_icon from '../../assets/accept.png';
import reject_icon from '../../assets/reject.png';

const Friends = () => {
  const { user } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchFriendsAndRequests = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch(`http://localhost:4000/api/neo4j/friends-info/${user.id}`),
        fetch(`http://localhost:4000/api/neo4j/sent-requests-info/${user.id}`)
      ]);

      const friendsData = await friendsRes.json();
      const requestsData = await requestsRes.json();

      if (friendsRes.ok) setFriends(friendsData.users);
      if (requestsRes.ok) setRequests(requestsData.users);
    } catch (err) {
      toast.error('Error al cargar amigos o solicitudes');
    }
  };

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [user]);

  const handleAccept = async (fromId) => {
    try {
      await fetch('http://localhost:4000/api/neo4j/make-friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId1: user.id, userId2: fromId })
      });

      toast.success('¡Solicitud aceptada!');

      // Update the requests list after accepting
      fetchFriendsAndRequests();
    } catch (err) {
      toast.error('Error al aceptar solicitud');
    }
  };

  const handleReject = async (fromId) => {
    try {
      await fetch('http://localhost:4000/api/neo4j/eliminate-request', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId, toId: user.id })
      });

      toast.info('Solicitud rechazada');

      //Update the requests list after rejecting
      fetchFriendsAndRequests();
    } catch (err) {
      toast.error('Error al rechazar solicitud');
    }
  };

  return (
    <div className="f-main-wrapper">
      <div className="f-container">
        <div className="header f-header">
          <div className="text">Amigos y Solicitudes</div>
          <div className="underline"></div>
        </div>
  
        <div className="f-columns">
          <div className="f-section">
            <h3 className="f-subtitle">Amigos</h3>
            <div className="f-user-list">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div className="f-user-row" key={friend._id}>
                    <img
                      src={friend.avatar_url || profile_icon}
                      alt="avatar"
                      className="f-avatar"
                    />
                    <div className="f-username">{friend.username}</div>
                    <div className="f-name">{friend.first_name} {friend.last_name}</div>
                    <div className="f-action f-message">
                      <img
                        src={send_message}
                        alt="Mensaje"
                        className="f-action-icon"
                        onClick={() => navigate(`/chat/${friend._id}`)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="f-empty">No hay amigos</div>
              )}
            </div>
          </div>
          
          <div className="f-section">
            <h3 className="f-subtitle">Solicitudes</h3>
            <div className="f-user-list">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <div className="f-user-row" key={req._id}>
                    <img
                      src={req.avatar_url || profile_icon}
                      alt="avatar"
                      className="f-avatar"
                    />
                    <div className="f-username">{req.username}</div>
                    <div className="f-name">{req.first_name} {req.last_name}</div>
                    <div className="f-action f-accept">
                      <img
                        src={accept_icon}
                        alt="Aceptar"
                        className="f-action-icon"
                        onClick={() => handleAccept(req._id)}
                      />
                    </div>
                    <div className="f-action f-reject">
                      <img
                        src={reject_icon}
                        alt="Rechazar"
                        className="f-action-icon"
                        onClick={() => handleReject(req._id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="f-empty">No hay solicitudes</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );    
};

export default Friends;
