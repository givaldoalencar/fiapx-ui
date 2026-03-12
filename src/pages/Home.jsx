import FileUploader from '../components/FileUploader';
import { useAuth } from 'react-oidc-context';

export default function Home() {
  const auth = useAuth();

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-4">
        <div>
          {/* <strong>Usuário logado:</strong> {auth.user?.profile?.email || 'Não identificado'} */}
        </div>
        {/* Espaço entre usuário e botão sair */}
        <div className="ms-auto">
          {/* Aqui pode ficar o botão sair, se existir */}
        </div>
      </div>
      <h1>Dashboard</h1>
      <FileUploader userEmail={auth.user?.profile?.email} />
    </div>
  );
}
