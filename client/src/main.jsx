import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from "react-redux"
import store from './redux/store.js'
import { ThemeProvider } from './components/ui/theme-provider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <Provider store={store}>
    <HelmetProvider>
      <div className='overflow-hidden' onContextMenu={(e)=> e.preventDefault()}>
          <App />
      </div>
    </HelmetProvider>
    </Provider>
      </ThemeProvider>
  </React.StrictMode>,
)
