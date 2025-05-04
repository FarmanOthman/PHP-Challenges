import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import { AuthProvider } from './context/AuthContext'
import AuthGuard from './components/auth/AuthGuard'

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/chat" 
            element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            } 
          />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App
