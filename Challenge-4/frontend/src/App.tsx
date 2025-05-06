import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/auth/AuthGuard';
import PageTransition from './components/layout/PageTransition';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route 
            path="/admin" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Admin />
                </PageTransition>
              </AuthGuard>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Chat />
                </PageTransition>
              </AuthGuard>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AuthGuard>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </AuthGuard>
            } 
          />
          <Route 
            path="/search" 
            element={
              <AuthGuard>
                <PageTransition>
                  <SearchResults />
                </PageTransition>
              </AuthGuard>
            } 
          />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
