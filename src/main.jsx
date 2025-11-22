import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// دالة إزالة صفحة التحميل
function removeSplash() {
  const splash = document.getElementById('splash-screen')
  if (!splash) return

  splash.style.opacity = '0'
  setTimeout(() => {
    if (splash && splash.parentNode)
      splash.parentNode.removeChild(splash)
  }, 500)
}

// نجعلها متاحة في كل المشروع
window.removeSplash = removeSplash

// ❌ يتم إزالة السبلّاش فقط عند انتهاء تحميل المشاريع
// window.addEventListener('load', removeSplash)
// setTimeout(removeSplash, 5000)
