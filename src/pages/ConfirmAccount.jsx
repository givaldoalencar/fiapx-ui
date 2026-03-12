import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { useState } from 'react';

const poolData = {
  UserPoolId: 'us-east-1_Qx3kOUgAl',
  ClientId: '50cjfpgec6f7npdrdigrspaaiv',
};
const userPool = new CognitoUserPool(poolData);

export default function ConfirmAccount() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleConfirm = (e) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.confirmRegistration(code, true, (err, result) => {
      if (err) setMsg(err.message);
      else setMsg('Conta confirmada! Agora você pode fazer login.');
    });
  };

  const handleResend = () => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.resendConfirmationCode((err, result) => {
      if (err) setMsg(err.message);
      else setMsg('Novo código enviado para seu e-mail.');
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <form onSubmit={handleConfirm} className="card p-5 shadow">
            <h2 className="mb-4 text-center">Confirmação de Cadastro</h2>
            <div className="mb-4">
              <input
                type="email"
                className="form-control form-control-lg py-3"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-mail cadastrado"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg py-3"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Código de confirmação"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3">Confirmar</button>
            <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleResend}>
              Reenviar código
            </button>
            <div className="mt-3 text-center text-danger">{msg}</div>
          </form>
        </div>
      </div>
    </div>
  );
}