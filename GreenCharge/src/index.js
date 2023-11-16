// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import RoutesComponent from './Routes'; // Assurez-vous que le chemin est correct
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';



const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RoutesComponent/>
  </React.StrictMode>,
);
