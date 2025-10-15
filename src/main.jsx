import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { pwaUtils } from './utils/pwa.js'

// Register PWA service worker
pwaUtils.registerSW();
pwaUtils.installPWA();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
