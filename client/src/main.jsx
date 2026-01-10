import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { SearchProvider } from './contexts/SearchContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <NotificationProvider>
        <CartProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </CartProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
)
