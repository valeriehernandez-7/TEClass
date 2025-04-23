import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../shared/Form.css';

const Chat = ({ fromId, toId }) => {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/chat/${fromId}/${toId}`);
        setMensajes(Object.values(res.data));
      } catch (err) {
        console.error('Error al obtener mensajes:', err);
      }
    };

    obtenerMensajes();
    const intervalo = setInterval(obtenerMensajes, 3000);
    return () => clearInterval(intervalo);
  }, [fromId, toId]);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    try {
      await axios.post('http://localhost:3001/chat', {
        fromId,
        toId,
        mensaje,
      });
      setMensaje('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Chat</div>
        <div className="underline" />
        <p style={{ color: 'black' }}>
          Conversación entre <b>{fromId}</b> y <b>{toId}</b>
        </p>
      </div>

      <div className="chat-mensajes">
        {mensajes.map((msg, i) => (
          <div key={i} className={`chat-burbuja ${msg.from === fromId ? 'chat-derecha' : 'chat-izquierda'}`}>
            <span><b>{msg.from}</b>: {msg.text}</span>
          </div>
        ))}
      </div>

      <div className="submit-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <div className="input">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </div>
        <div className="submit" onClick={enviarMensaje}>Enviar</div>
      </div>
    </div>
  );
};

export default Chat;