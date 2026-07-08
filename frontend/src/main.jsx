import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
    <App />
    <ToastContainer
  position="top-right"
  autoClose={2500}
  theme="colored"
  toastStyle={{
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 500,
  }}
/>
    </GoogleOAuthProvider>
  </StrictMode>,
)
