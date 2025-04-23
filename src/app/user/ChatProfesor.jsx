import React from 'react';
import Chat from './chat';

const ChatProfesor = () => {
  const profesorId = 'prof456';
  const estudianteId = 'est123';

  return <Chat fromId={profesorId} toId={estudianteId} />;
};

export default ChatProfesor;