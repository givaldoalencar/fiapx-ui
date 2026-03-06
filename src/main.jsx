import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from 'react-oidc-context'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const oidcConfig = {
  authority: "https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_NsvFmQl51",
  client_id: "hlqnolj6dutpmbehp9t6g7n0u",
  //redirect_uri: "https://d2d6yzvdcpll40.cloudfront.net/",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <AuthProvider {...oidcConfig}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
