import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/login.css';
import './styles/dashboard.css';
import './styles/records.css';
import './styles/users.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
