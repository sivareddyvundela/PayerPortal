import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberClaims } from '../../services/api.js'

const statusMap = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Denied: 'badge-denied',
}

function Claims() {
  const { currentUser } = useAuth()
  const [claims, setClaims] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    getMemberClaims(currentUser?.memberId).then(setClaims)
  }, [currentUser])

  const filtered = claims.filter((c) => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus
    const matchSearch =
      c.claimId.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your medical claims history for 2024</p>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          {['All', 'Paid', 'Pending', 'Denied'].map((s) => {
            const count = s === 'All' ? claims.length : claims.filter((c) => c.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  filterStatus === s
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {s} ({count})
              </button>
            )
          })}
          <input
            type="text"
            placeholder="Search by ID, provider, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
          />
        </div>

        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Claim ID', 'Date', 'Provider', 'Type', 'Billed', 'Allowed', 'Plan Paid', 'Your Cost', 'Status'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.claimId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-700 whitespace-nowrap">{c.claimId}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(c.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-800 max-w-xs truncate">{c.provider}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{c.type}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium whitespace-nowrap">${c.billed.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">${c.allowed.toFixed(2)}</td>
                    <td className="py-3 px-4 text-green-700 font-semibold whitespace-nowrap">${c.paid.toFixed(2)}</td>
                    <td className="py-3 px-4 text-blue-700 font-semibold whitespace-nowrap">${c.memberResponsibility.toFixed(2)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={statusMap[c.status] || 'badge-pending'}>{c.status}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                      No claims found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Showing {filtered.length} of {claims.length} claims
          </div>
        </div>
      </div>
    </div>
  )
}

export default Claims
