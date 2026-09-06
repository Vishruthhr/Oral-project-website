import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DentalProvider } from './context/DentalContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DentalProvider>
      <App />
    </DentalProvider>
  </React.StrictMode>
);
