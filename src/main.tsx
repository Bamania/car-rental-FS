import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.tsx'
import { CarDataProvider } from './pages/context/carData.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <CarDataProvider>
    <App />
    </CarDataProvider>
  </StrictMode>,
)
