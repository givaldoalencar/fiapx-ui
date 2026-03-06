import { useAuth } from 'react-oidc-context'
import FileUploader from '../components/FileUploader'
import Navbar from '../components/NavBar.jsx'

export default function Dashboard() {
  
  const auth = useAuth()

  return (
    <div>
      <Navbar />
      <h1>Dashboard</h1>
      <FileUploader />
    </div>
    
  )
}
