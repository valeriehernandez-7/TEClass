import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/index.css';
import App from './App';
import { UserProvider } from './shared/UserSession.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
  </React.StrictMode>
);


