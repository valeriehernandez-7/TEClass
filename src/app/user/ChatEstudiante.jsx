import React from 'react';
import Chat from './chat';

const ChatEstudiante = () => {
  const estudianteId = 'est123';
  const profesorId = 'prof456';

  return <Chat fromId={estudianteId} toId={profesorId} />;
};

export default ChatEstudiante;