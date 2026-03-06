import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const poolData = {
  UserPoolId: 'us-east-1_Qx3kOUgAl', // coloque seu novo UserPoolId aqui
  ClientId: '50cjfpgec6f7npdrdigrspaaiv', // coloque seu novo ClientId aqui
};
const userPool = new CognitoUserPool(poolData);

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) setMsg(err.message);
      else setMsg('Cadastro realizado! Verifique seu e-mail para confirmar.');
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <form onSubmit={handleRegister} className="card p-5 shadow">
            <h2 className="mb-4 text-center">Cadastro</h2>
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
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3">Cadastrar</button>
            <div className="mt-3 text-center text-danger">{msg}</div>
            <div className="mt-4 text-center">
              <span>Já recebeu o código? </span>
              <Link to="/confirm">Confirmar cadastro</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}