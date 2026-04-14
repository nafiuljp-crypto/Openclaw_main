import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize dark mode from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  // Update toggle button icon
  setTimeout(() => {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }, 0);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
