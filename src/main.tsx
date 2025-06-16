import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CarDataProvider } from './context/carData.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <CarDataProvider>
    <App />
    </CarDataProvider>
  </StrictMode>,
)
