import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function ProtectedRoute({ children, requiredType }) {
  const { isAuthenticated, currentUser } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredType && currentUser?.type !== requiredType) {
    const redirect = currentUser?.type === 'member' ? '/member/dashboard' : '/provider/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}

export default ProtectedRoute
