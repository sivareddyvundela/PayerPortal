import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">
          HealthBridge
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-sm font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{currentUser?.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                currentUser?.type === 'member'
                  ? 'bg-blue-600 text-blue-100'
                  : 'bg-teal-600 text-teal-100'
              }`}>
                {currentUser?.type === 'member' ? 'Member' : 'Provider'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/" className="text-sm text-blue-200 hover:text-white transition-colors">
            Home
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
