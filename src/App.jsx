import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ConfirmAccount from './pages/ConfirmAccount';
import DownloadList from './pages/DownloadList';

function App() {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));
  const isPublicRoute = ['/login', '/register', '/confirm'].includes(location.pathname);

  return (
    <>
      {!isPublicRoute && isLoggedIn && <Navbar />}
      <div style={{ maxWidth: 600, margin: '0 auto', marginTop: 50, fontFamily: 'Arial' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm" element={<ConfirmAccount />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/downloads" element={isLoggedIn ? <DownloadList /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;