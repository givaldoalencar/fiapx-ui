import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ConfirmAccount from './pages/ConfirmAccount';
import DownloadList from './pages/DownloadList';

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "hlqnolj6dutpmbehp9t6g7n0u";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://sa-east-1nsvfmql51.auth.sa-east-1.amazoncognito.com";
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    auth.removeUser();
    window.location.href = logoutUrl;
  };

  if (auth.isLoading) {
    return <div>Carregando...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', marginTop: 50, fontFamily: 'Arial' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm" element={<ConfirmAccount />} />
          <Route path="/" element={<Home />} /> {/* Remove o auth.isAuthenticated */}
          <Route path="/dashboard" element={auth.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/downloads" element={<DownloadList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;