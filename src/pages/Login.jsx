import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const poolData = {
  UserPoolId: 'us-east-1_Qx3kOUgAl',
  ClientId: '50cjfpgec6f7npdrdigrspaaiv',
};
const userPool = new CognitoUserPool(poolData);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        setMsg('Login realizado!');
        setTimeout(() => {
          navigate('/'); // Redireciona para a home ou dashboard
        }, 1000);
      },
      onFailure: (err) => setMsg(err.message),
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <form onSubmit={handleLogin} className="card p-5 shadow">
            <h2 className="mb-4 text-center">Login</h2>
            <div className="mb-4">
              <input
                type="email"
                className="form-control form-control-lg py-3"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-mail"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="form-control form-control-lg py-3"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Senha"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3">Entrar</button>
            <div className="mt-3 text-center text-danger">{msg}</div>
            <div className="mt-4 text-center">
              <span>Não tem conta? </span>
              <Link to="/register">Cadastre-se</Link>
            </div>
            <div className="mt-4 text-center">
              <span>Não confirmou o cadastro? </span>
              <Link to="/confirm">Confirmar cadastro</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}