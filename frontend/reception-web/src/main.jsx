import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("MAIN.JSX LOADED");

const params = new URLSearchParams(window.location.search);
const tokenFromUrl = params.get("token");

console.log("TOKEN FROM URL =", tokenFromUrl);

if (tokenFromUrl) {
  localStorage.setItem("token", tokenFromUrl);
  console.log("TOKEN SAVED TO LOCALSTORAGE");
  window.history.replaceState({}, document.title, "/");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
