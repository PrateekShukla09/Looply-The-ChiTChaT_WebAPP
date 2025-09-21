import React from 'react';
import ReactDOM from 'react-dom/client';
 // ← Make sure this line exists
import App from './App';
import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);