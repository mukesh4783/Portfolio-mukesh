import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/archivo/standard.css';
import '@fontsource-variable/spline-sans-mono/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
