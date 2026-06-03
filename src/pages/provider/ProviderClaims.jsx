import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import ProviderSidebar from '../../components/provider/ProviderSidebar.jsx'
import { getProviderClaims } from '../../services/api.js'

const statusMap = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Denied: 'badge-denied',
}

function ProviderClaims() {
  const { currentUser } = useAuth()
  const [claims, setClaims] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    getProviderClaims(currentUser?.npi).then(setClaims)
  }, [currentUser])

  const filtered = claims.filter((c) => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus
    const matchSearch =
      c.claimId.toLowerCase().includes(search.toLowerCase()) ||
      c.patient.toLowerCase().includes(search.toLowerCase()) ||
      c.cptCodes.join(',').includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalBilled = filtered.reduce((s, c) => s + c.billedAmount, 0)
  const totalPaid = filtered.reduce((s, c) => s + c.paidAmount, 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-500 text-sm mt-0.5">Claims submitted to HealthBridge</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-xl font-bold text-gray-900">{claims.length}</div>
            <div className="text-xs text-gray-500">Total Claims</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-green-700">{claims.filter((c) => c.status === 'Paid').length}</div>
            <div className="text-xs text-gray-500">Paid</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-gray-900">${totalBilled.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Billed</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-teal-700">${totalPaid.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Received</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
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
            placeholder="Search claims..."
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
                  {['Claim ID', 'Patient', 'Date of Service', 'CPT Codes', 'Billed', 'Allowed', 'Paid', 'Status'].map((h) => (
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
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{c.patient}</div>
                      <div className="text-xs text-gray-500 font-mono">{c.memberId}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(c.dateOfService).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.cptCodes.map((code) => (
                          <span key={code} className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded font-mono">{code}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">${c.billedAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">${c.allowedAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold text-green-700 whitespace-nowrap">${c.paidAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>
                        <span className={statusMap[c.status] || 'badge-pending'}>{c.status}</span>
                        {c.denialReason && (
                          <div className="text-xs text-red-500 mt-1 max-w-xs">{c.denialReason}</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      No claims found.
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

export default ProviderClaims
