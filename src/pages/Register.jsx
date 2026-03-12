import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMsg('');

    try {
      await axios.post('/api/User/CreateUser', {
        name,
        email,
        password,
      });

      setMsg('Cadastro realizado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      const status = err?.response?.status;
      const responseData = err?.response?.data;

      let apiMessage = '';

      if (typeof responseData === 'string') {
        apiMessage = responseData;
      } else if (responseData?.message) {
        apiMessage = responseData.message;
      } else if (responseData?.title) {
        apiMessage = responseData.title;
      } else if (responseData?.errors) {
        apiMessage = Object.values(responseData.errors).flat().join(' | ');
      } else if (err?.message) {
        apiMessage = err.message;
      }

      const safeMessage = (apiMessage || 'Erro ao realizar cadastro.').toString().slice(0, 300);
      setMsg(status ? `Erro ${status}: ${safeMessage}` : safeMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <form onSubmit={handleRegister} className="card p-5 shadow">
            <h2 className="mb-4 text-center">Cadastro</h2>
            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg py-3"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nome"
                required
              />
            </div>
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
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <div className="mt-3 text-center text-danger">{msg}</div>
            <div className="mt-4 text-center">
              <span>Já tem conta? </span>
              <Link to="/login">Entrar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}