import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberReferrals } from '../../services/api.js'

const statusMap = {
  Active: 'badge-active',
  Pending: 'badge-pending',
  Completed: 'badge-paid',
  Expired: 'bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full',
}

function Referrals() {
  const { currentUser } = useAuth()
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
    getMemberReferrals(currentUser?.memberId).then(setReferrals)
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Referrals & Authorizations</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track your specialist referrals and prior authorizations</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-700">{referrals.filter((r) => r.status === 'Active').length}</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{referrals.filter((r) => r.status === 'Pending').length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-700">{referrals.filter((r) => r.status === 'Completed').length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>

        <div className="space-y-4">
          {referrals.map((ref) => (
            <div key={ref.referralId} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{ref.specialist}</h3>
                    <span className={statusMap[ref.status] || 'badge-pending'}>{ref.status}</span>
                  </div>
                  <p className="text-sm text-teal-600 font-medium">{ref.specialty}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Auth #</div>
                  <div className="text-sm font-mono font-bold text-blue-700">{ref.authNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Referred By</div>
                  <div className="text-sm font-semibold text-gray-800">{ref.referredBy}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Issue Date</div>
                  <div className="text-sm font-semibold text-gray-800">{new Date(ref.dateIssued).toLocaleDateString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Expiration</div>
                  <div className="text-sm font-semibold text-gray-800">{new Date(ref.expirationDate).toLocaleDateString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Visits Used / Auth</div>
                  <div className="text-sm font-bold">
                    <span className="text-blue-700">{ref.visitsUsed}</span>
                    <span className="text-gray-500"> / {ref.visitsAuthorized}</span>
                  </div>
                </div>
              </div>

              {/* Visit progress */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-teal-500"
                    style={{ width: `${(ref.visitsUsed / ref.visitsAuthorized) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{ref.visitsUsed} of {ref.visitsAuthorized} authorized visits used</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-0.5">Reason for Referral</div>
                <div className="text-sm text-gray-800">{ref.reason}</div>
              </div>
            </div>
          ))}
          {referrals.length === 0 && (
            <div className="card text-center text-gray-400 py-12">No referrals found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Referrals
