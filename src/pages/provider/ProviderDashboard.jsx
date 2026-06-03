import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import ProviderSidebar from '../../components/provider/ProviderSidebar.jsx'
import { getProviderDashboardStats, getProviderClaims } from '../../services/api.js'

const statusMap = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Denied: 'badge-denied',
}

function StatCard({ label, value, sub, borderColor, link, prefix }) {
  const content = (
    <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <div className="text-2xl font-bold text-gray-900">{prefix || ''}{typeof value === 'number' && prefix ? value.toLocaleString() : value}</div>
      <div className="text-sm font-semibold text-gray-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

function ProviderDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentClaims, setRecentClaims] = useState([])

  useEffect(() => {
    getProviderDashboardStats(currentUser?.npi).then(setStats)
    getProviderClaims(currentUser?.npi).then((c) => setRecentClaims(c.slice(0, 3)))
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentUser?.name}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {currentUser?.specialty} · NPI: {currentUser?.npi}
              </p>
            </div>
            <span className="ml-auto bg-gradient-to-r from-blue-700 to-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Provider Portal
            </span>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <StatCard label="Total Patients" value={stats.totalPatients} borderColor="border-blue-500" link="/provider/patients" />
              <StatCard label="Pending Claims" value={stats.pendingClaims} sub="Awaiting payment" borderColor="border-yellow-500" link="/provider/claims" />
              <StatCard label="Paid Claims" value={stats.paidClaims} sub="This year" borderColor="border-green-500" link="/provider/claims" />
              <StatCard label="Denied Claims" value={stats.deniedClaims} borderColor="border-red-500" link="/provider/claims" />
              <StatCard label="Total Received" value={stats.totalReceived} prefix="$" sub="This year" borderColor="border-teal-500" link="/provider/payments" />
              <StatCard label="Pending Amount" value={stats.pendingAmount} prefix="$" borderColor="border-orange-500" link="/provider/claims" />
            </div>
          </>
        )}

        {/* Recent claims table */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Claims</h3>
            <Link to="/provider/claims" className="text-sm text-blue-600 hover:underline font-medium">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Claim ID', 'Patient', 'Date of Service', 'Billed', 'Paid', 'Status'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((c) => (
                  <tr key={c.claimId} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono text-xs text-gray-700">{c.claimId}</td>
                    <td className="py-3 px-3 text-gray-800">{c.patient}</td>
                    <td className="py-3 px-3 text-gray-600">{new Date(c.dateOfService).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-semibold text-gray-800">${c.billedAmount.toFixed(2)}</td>
                    <td className="py-3 px-3 font-semibold text-green-700">${c.paidAmount.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={statusMap[c.status] || 'badge-pending'}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'My Patients', to: '/provider/patients', icon: '👥', color: 'bg-blue-50 hover:bg-blue-100' },
              { label: 'Submit Claim', to: '/provider/claims', icon: '📋', color: 'bg-teal-50 hover:bg-teal-100' },
              { label: 'View Payments', to: '/provider/payments', icon: '💰', color: 'bg-green-50 hover:bg-green-100' },
              { label: 'My Profile', to: '/provider/profile', icon: '👤', color: 'bg-purple-50 hover:bg-purple-100' },
            ].map((ql) => (
              <Link key={ql.to} to={ql.to} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${ql.color} transition-colors text-center`}>
                <span className="text-2xl">{ql.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{ql.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard
