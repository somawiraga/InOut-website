import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { EnquiryModalProvider } from './contexts/EnquiryModalContext'
import { CartProvider } from './contexts/CartContext'
import './styles/global.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <EnquiryModalProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </EnquiryModalProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
