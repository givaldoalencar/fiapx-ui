import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

export default function Navbar() {
  const auth = useAuth();

  const signOutRedirect = () => {
    auth.removeUser();
    // Ajuste: redireciona para Cognito logout
    const clientId = "hlqnolj6dutpmbehp9t6g7n0u"; // seu clientId Cognito
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://sa-east-1nsvfmql51.auth.sa-east-1.amazoncognito.com";
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    window.location.href = logoutUrl;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center ms-auto">
          <Link to="/downloads" className="btn btn-outline-primary me-3">
            Downloads
          </Link>
          <button className="btn btn-danger" onClick={signOutRedirect}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
