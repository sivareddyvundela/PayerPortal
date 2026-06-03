import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AgentforceChat from './AgentforceChat.jsx'

const navItems = [
  { path: '/member/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/member/profile', label: 'My Profile', icon: '👤' },
  { path: '/member/claims', label: 'Claims', icon: '📋' },
  { path: '/member/eob', label: 'Explanation of Benefits', icon: '📄' },
  { path: '/member/benefits', label: 'Benefits & Coverage', icon: '🛡️' },
  { path: '/member/pharmacy', label: 'Pharmacy', icon: '💊' },
  { path: '/member/referrals', label: 'Referrals', icon: '📝' },
  { path: '/member/providers', label: 'My Providers', icon: '🏥' },
  { path: '/member/out-of-pocket', label: 'Out of Pocket', icon: '💳' },
]

function MemberSidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
    <AgentforceChat />
    <aside className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              HealthBridge
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Member Portal</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {currentUser?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{currentUser?.name}</div>
              <div className="text-xs text-gray-400 truncate">{currentUser?.memberId}</div>
              <div className="text-xs text-teal-400 font-medium">{currentUser?.plan}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-300 transition-colors text-sm"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span className="text-lg">↩</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
    </>
  )
}

export default MemberSidebar
