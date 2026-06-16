import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberClaims } from '../../services/api.js'

const statusMap = {
  Paid:    'badge-paid',
  Pending: 'badge-pending',
  Denied:  'badge-denied',
}

function Claims() {
  const { currentUser } = useAuth()
  const [claims, setClaims] = useState([])

  useEffect(() => {
    getMemberClaims(currentUser?.memberId).then(setClaims)
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your medical claims history for 2024</p>
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
                {claims.map((c) => (
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
                {claims.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                      No claims found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            {claims.length} claims
          </div>
        </div>
      </div>
    </div>
  )
}

export default Claims
