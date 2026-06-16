import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberDashboardStats, getMemberClaims } from '../../services/api.js'

const statusColors = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Denied: 'badge-denied',
}

function ProgressBar({ met, max, color }) {
  const pct = Math.min((met / max) * 100, 100).toFixed(1)
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function StatCard({ label, value, sub, borderColor, link }) {
  const content = (
    <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-semibold text-gray-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

function MemberDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentClaims, setRecentClaims] = useState([])

  useEffect(() => {
    getMemberDashboardStats(currentUser?.memberId).then(setStats)
    getMemberClaims(currentUser?.memberId).then((c) => setRecentClaims(c.slice(0, 3)))
  }, [currentUser])

  const deductiblePct = stats ? ((stats.deductibleMet / stats.deductibleMax) * 100).toFixed(0) : 0
  const oopPct = stats ? ((stats.oopMet / stats.oopMax) * 100).toFixed(0) : 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {currentUser?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Here's your health plan summary for 2024</p>
              </div>
              <span className="ml-auto bg-gradient-to-r from-blue-700 to-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {currentUser?.plan}
              </span>
            </div>
          </div>

          {/* Stat cards row 1 */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <StatCard label="Claims" value={stats.claims} sub="This year" borderColor="border-blue-500" link="/member/claims" />
              <StatCard label="Prescriptions" value={stats.prescriptions} sub="Active Rx" borderColor="border-teal-500" link="/member/pharmacy" />
              <StatCard label="Appointments" value={stats.appointments} sub="Upcoming" borderColor="border-indigo-500" />
              <StatCard label="Referrals" value={stats.referrals} sub="Active" borderColor="border-purple-500" link="/member/referrals" />
              <StatCard label="EOBs" value={stats.eob} sub="Documents" borderColor="border-orange-500" link="/member/eob" />
            </div>
          )}

          {/* Progress row */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Individual Deductible</h3>
                  <span className="text-sm font-bold text-blue-700">{deductiblePct}%</span>
                </div>
                <ProgressBar met={stats.deductibleMet} max={stats.deductibleMax} color="bg-blue-500" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>${stats.deductibleMet.toLocaleString()} met</span>
                  <span>${stats.deductibleMax.toLocaleString()} max</span>
                </div>
              </div>
              {/* Out-of-Pocket Maximum hidden for demo */}
              {false && (
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Out-of-Pocket Maximum</h3>
                  <span className="text-sm font-bold text-teal-700">{oopPct}%</span>
                </div>
                <ProgressBar met={stats.oopMet} max={stats.oopMax} color="bg-teal-500" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>${stats.oopMet.toLocaleString()} met</span>
                  <span>${stats.oopMax.toLocaleString()} max</span>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Recent Claims */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Recent Claims</h3>
              <Link to="/member/claims" className="text-sm text-blue-600 hover:underline font-medium">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Claim ID</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Provider</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Amount</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClaims.map((claim) => (
                    <tr key={claim.claimId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-gray-700">{claim.claimId}</td>
                      <td className="py-3 px-3 text-gray-600">{new Date(claim.date).toLocaleDateString()}</td>
                      <td className="py-3 px-3 text-gray-700">{claim.provider}</td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-800">${claim.billed.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={statusColors[claim.status] || 'badge-pending'}>{claim.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                // { label: 'View Benefits', to: '/member/benefits', icon: '🛡️', color: 'bg-blue-50 hover:bg-blue-100' },
                { label: 'My Pharmacy', to: '/member/pharmacy', icon: '💊', color: 'bg-teal-50 hover:bg-teal-100' },
                { label: 'Find a Provider', to: '/member/providers', icon: '🏥', color: 'bg-indigo-50 hover:bg-indigo-100' },
                // { label: 'Out-of-Pocket', to: '/member/out-of-pocket', icon: '💳', color: 'bg-purple-50 hover:bg-purple-100' },
              ].map((ql) => (
                <Link
                  key={ql.to}
                  to={ql.to}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl ${ql.color} transition-colors text-center`}
                >
                  <span className="text-2xl">{ql.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{ql.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MemberDashboard
