import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const serviceCards = [
  {
    title: 'Member Services',
    icon: '🏥',
    color: 'from-blue-500 to-blue-700',
    items: ['Claims Management', 'Benefits Overview', 'EOB Documents', 'Prescription Refills'],
  },
  {
    title: 'Provider Solutions',
    icon: '👨‍⚕️',
    color: 'from-teal-500 to-teal-700',
    items: ['Patient Management', 'Claims Submission', 'Payment Tracking', 'Prior Auth'],
  },
  {
    title: 'Telehealth',
    icon: '💻',
    color: 'from-indigo-500 to-indigo-700',
    items: ['Virtual Visits', '24/7 Access', 'Mental Health', 'Follow-up Care'],
  },
  {
    title: 'Wellness Programs',
    icon: '🌿',
    color: 'from-emerald-500 to-emerald-700',
    items: ['Health Coaching', 'Preventive Care', 'Fitness Rewards', 'Nutrition Guidance'],
  },
]

const features = [
  { icon: '🔒', label: 'Secure Portal' },
  { icon: '⚡', label: 'Real-time Claims' },
  { icon: '📞', label: '24/7 Support' },
  { icon: '✅', label: 'HIPAA Compliant' },
]

function Home() {
  const navigate = useNavigate()
  const { login, isAuthenticated, currentUser } = useAuth()
  const [userType, setUserType] = useState('member')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect
  if (isAuthenticated) {
    const dest = currentUser?.type === 'member' ? '/member/dashboard' : '/provider/dashboard'
    navigate(dest, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 400))
    const result = login(username, password, userType)

    if (result.success) {
      const dest = result.user.type === 'member' ? '/member/dashboard' : '/provider/dashboard'
      navigate(dest)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const fillDemo = () => {
    if (userType === 'member') {
      setUsername('member@healthbridge.com')
      setPassword('Member@123')
    } else {
      setUsername('provider@healthbridge.com')
      setPassword('Provider@123')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── LEFT: Hero Content ─────────────────────────────────────────────── */}
      <div className="lg:w-3/5 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white flex flex-col">
        {/* Top nav bar */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
              HealthBridge
            </span>
          </div>
          <div className="flex gap-4 text-sm text-blue-200">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex-1 px-8 py-10 flex flex-col justify-between">
          {/* Hero text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 text-teal-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Powered by Salesforce Health Cloud
            </div>
            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-4">
              Comprehensive<br />
              <span className="bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                Health Plan Management
              </span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed max-w-xl mb-8">
              Your Health, Our Priority. HealthBridge connects members and providers
              on a single, secure platform — manage claims, benefits, and care coordination all in one place.
            </p>

            {/* Service cards 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {serviceCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 cursor-default"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} mb-3 text-xl`}>
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2 text-sm">{card.title}</h3>
                  <ul className="space-y-1">
                    {card.items.map((item) => (
                      <li key={item} className="text-xs text-blue-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Features strip */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-wrap gap-6">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-blue-200">
                  <span className="text-base">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login Panel ──────────────────────────────────────────────── */}
      <div className="lg:w-2/5 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-teal-600 mb-4 shadow-lg">
              <span className="text-white text-2xl font-black">H</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your HealthBridge account</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* User type toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => { setUserType('member'); setError(''); setUsername(''); setPassword('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  userType === 'member'
                    ? 'bg-gradient-to-r from-blue-700 to-teal-600 text-white shadow-inner'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => { setUserType('provider'); setError(''); setUsername(''); setPassword('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  userType === 'provider'
                    ? 'bg-gradient-to-r from-blue-700 to-teal-600 text-white shadow-inner'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Provider
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {userType === 'member' ? 'Member Email' : 'Provider Email'}
                </label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={userType === 'member' ? 'member@healthbridge.com' : 'provider@healthbridge.com'}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">OR</div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                New user?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                <span>🔑</span> Demo Credentials
              </p>
              {userType === 'member' ? (
                <div className="text-xs text-blue-600 space-y-1">
                  <div><span className="font-medium">Email:</span> member@healthbridge.com</div>
                  <div><span className="font-medium">Password:</span> Member@123</div>
                </div>
              ) : (
                <div className="text-xs text-blue-600 space-y-1">
                  <div><span className="font-medium">Email:</span> provider@healthbridge.com</div>
                  <div><span className="font-medium">Password:</span> Provider@123</div>
                </div>
              )}
              <button
                type="button"
                onClick={fillDemo}
                className="mt-2 text-xs text-blue-700 font-semibold underline hover:no-underline"
              >
                Fill demo credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
