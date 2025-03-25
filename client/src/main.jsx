import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css';
import App from './App.jsx'
import { MyProvider } from "../src/components/Auth/MyContext";
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <MyProvider>
    <App />
    </MyProvider>
  </StrictMode>,
)
