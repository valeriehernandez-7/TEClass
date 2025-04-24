import React, { useEffect, useState, useContext } from 'react'; 
import { useParams } from 'react-router-dom';
import { UserContext } from '../../shared/UserSession';

import '../../shared/Form.css';
import './Chat.css';

import attach_icon from '../../assets/attach_icon.png';

const API_URL = 'http://localhost:4000/api';

const Chat = () => {
    const { toId } = useParams();
    const { user } = useContext(UserContext);
    const fromId = user?.id;

    const [mensaje, setMensaje] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [toUser, setToUser] = useState(null);

    useEffect(() => {
        const obtenerToUser = async () => {
            try {
                const res = await fetch(`${API_URL}/mongo/by-id/${toId}`);
                if (!res.ok) throw new Error('No se pudo obtener el usuario destino');
                const data = await res.json();
                setToUser(data);
            } catch (err) {
                console.error(err);
            }
        };
        obtenerToUser();
    }, [toId]);

    useEffect(() => {
        const obtenerMensajes = async () => {
            try {
                const res = await fetch(`${API_URL}/redis/chat-upload/${fromId}/${toId}`);
                if (!res.ok) throw new Error('Error al obtener mensajes');
                const data = await res.json();
                setMensajes(data.sort((a, b) => a.timestamp - b.timestamp));
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
            const res = await fetch(`${API_URL}/redis/send-message`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Error al enviar mensaje');

            setMensaje('');
            setArchivo(null);
            document.getElementById('fileInput').value = '';
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
        }
    };

    const handleAttachClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className="ch-container">
            <div className="header">
                <div className="text">Chat</div>
                <div className="underline" />
                <p style={{ color: 'black' }}>
                    Conversación entre <b>{user.username}</b> y <b>{toUser?.username || toId}</b>
                </p>
            </div>

            <div className="ch-mensajes">
                {mensajes.map((msg, i) => (
                    <div key={i} className={`ch-burbuja ${msg.from === user.username ? 'ch-derecha' : 'ch-izquierda'}`}>
                        <span><b>{msg.from}</b>:</span>
                        {msg.text && <p>{msg.text}</p>}
                        {msg.fileUrl && (
                            msg.fileType?.startsWith('image/') ? (
                                <img src={`http://localhost:4000${msg.fileUrl}`} alt="archivo" style={{ maxWidth: '200px' }} />
                            ) : (
                                <a href={`http://localhost:4000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                    Descargar archivo ({msg.fileType})
                                </a>
                            )
                        )}
                    </div>
                ))}
            </div>

            <div className="ch-submit-container">
                <div className="ch-input-wrapper">
                    <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        className="ch-input"
                    />
                    <img
                        src={attach_icon}
                        alt="Adjuntar archivo"
                        onClick={handleAttachClick}
                        className="ch-attach-icon"
                    />
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => setArchivo(e.target.files[0])}
                    />
                </div>
                <div
                    className={`ch-submit ${(!mensaje.trim() && !archivo) ? 'disabled' : ''}`}
                    onClick={enviarMensaje}
                    style={{ cursor: (!mensaje.trim() && !archivo) ? 'not-allowed' : 'pointer' }}
                >
                    Enviar
                </div>
            </div>
        </div>
    );
};

export default Chat;
