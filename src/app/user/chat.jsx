import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../shared/Form.css';

const Chat = ({ fromId, toId }) => {
  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/chat/${fromId}/${toId}`);
        const mensajesOrdenados = res.data.sort((a, b) => a.timestamp - b.timestamp);
        setMensajes(mensajesOrdenados);
      } catch (err) {
        console.error('Error al obtener mensajes:', err);
      }
    };

    obtenerMensajes();
    const intervalo = setInterval(obtenerMensajes, 3000);
    return () => clearInterval(intervalo);
  }, [fromId, toId]);

  const enviarMensaje = async () => {
    if (!mensaje.trim() && !archivo) return;

    const formData = new FormData();
    formData.append('from_id', fromId);
    formData.append('to_id', toId);
    formData.append('message', mensaje);
    if (archivo) formData.append('file', archivo);

    try {
      await axios.post('http://localhost:3001/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMensaje('');
      setArchivo(null);
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
            <span><b>{msg.from}</b>:</span>
            {msg.text && <p>{msg.text}</p>}
            {msg.fileUrl && (
              msg.fileType.startsWith('image/') ? (
                <img src={`http://localhost:3001${msg.fileUrl}`} alt="archivo" style={{ maxWidth: '200px' }} />
              ) : (
                <a href={`http://localhost:3001${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
                  Descargar archivo ({msg.fileType})
                </a>
              )
            )}
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
        <input type="file" onChange={(e) => setArchivo(e.target.files[0])} />
        <div className="submit" onClick={enviarMensaje}>Enviar</div>
      </div>
    </div>
  );
};

export default Chat;