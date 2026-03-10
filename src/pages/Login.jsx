import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const extractApiMessage = (data) => {
    if (!data) return '';

    if (typeof data === 'string') {
      return data.replace(/^"|"$/g, '').trim();
    }

    if (data?.message) return data.message;
    if (data?.title) return data.title;
    if (data?.detail) return data.detail;

    if (data?.errors) {
      const flatErrors = Object.values(data.errors).flat().filter(Boolean);
      if (flatErrors.length) return flatErrors.join(' | ');
    }

    return '';
  };

  const getLoginErrorMessage = (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    const apiMessage = extractApiMessage(data);
    if (apiMessage) return apiMessage;

    if (status === 401) return 'Credenciais inválidas.';
    if (status === 403) return 'Usuário sem permissão para acessar.';
    if (status === 500) return 'Erro interno da API. Tente novamente.';

    if (err?.message === 'Network Error') {
      return 'Não foi possível conectar à API.';
    }

    return 'Não foi possível entrar. Verifique e-mail e senha.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg('');
    localStorage.removeItem('loginResponse');
    localStorage.removeItem('authToken');

    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const apiMessage = extractApiMessage(response?.data);
      const token = response?.data?.token || response?.data?.accessToken || response?.data?.jwt;
      const isSuccessFlag = response?.data?.success === true;

      if (!token && !isSuccessFlag) {
        setMsg(apiMessage || 'Não foi possível entrar. Verifique suas credenciais.');
        return;
      }

      if (apiMessage && /(inválid|inválid|inval|invalid|credenciais?|não autorizado|nao autorizado|usuário inválido|usuario invalido)/i.test(apiMessage)) {
        setMsg(apiMessage);
        return;
      }

      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (response?.data) {
        localStorage.setItem('loginResponse', JSON.stringify(response.data));
      }

      setMsg('Login realizado com sucesso!');
      navigate('/home');
    } catch (err) {
      setMsg(getLoginErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
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
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            {msg && (
              <div className="mt-3 alert alert-danger text-center fw-semibold" role="alert">
                {msg}
              </div>
            )}
            <div className="mt-4 text-center">
              <span>Não tem conta? </span>
              <Link to="/register">Cadastre-se</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}