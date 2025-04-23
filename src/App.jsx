import React from 'react';
import Matricula from './app/enrollment/matricula.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatEstudiante from './app/user/ChatEstudiante.jsx';
import ChatProfesor from './app/user/ChatProfesor.jsx';

/*
function App() {
  return (
    <div className="App">
      <Matricula />
    </div>
  );
}
*/

function App() {
  return (
    
    <div className="App">
      <ChatEstudiante />
    </div>
  );
}

export default App;