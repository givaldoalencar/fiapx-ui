import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const signOutRedirect = () => {
    localStorage.removeItem('loginResponse');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center ms-auto">
          
        <Link to="/home" className="btn btn-outline-primary me-3">
          Carregar novo vídeo
        </Link>
      
          <Link to="/downloads" className="btn btn-outline-primary me-3">
            Meus vídeos
          </Link>
          <button className="btn btn-danger" onClick={signOutRedirect}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
