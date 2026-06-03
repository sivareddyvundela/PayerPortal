import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberPharmacy } from '../../services/api.js'

const statusMap = {
  Active: 'badge-active',
  'Refill Needed': 'badge-denied',
}

const tierColors = {
  'Tier 1 (Generic)': 'bg-green-100 text-green-700',
  'Tier 2 (Preferred Generic)': 'bg-blue-100 text-blue-700',
  'Tier 3 (Non-Preferred Brand)': 'bg-yellow-100 text-yellow-700',
}

function Pharmacy() {
  const { currentUser } = useAuth()
  const [prescriptions, setPrescriptions] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMemberPharmacy(currentUser?.memberId).then(setPrescriptions)
  }, [currentUser])

  const filtered = prescriptions.filter(
    (p) =>
      p.drugName.toLowerCase().includes(search.toLowerCase()) ||
      p.prescribedBy.toLowerCase().includes(search.toLowerCase()) ||
      p.pharmacy.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your active prescriptions and refill status</p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex gap-3">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 text-center">
              <div className="text-xl font-bold text-gray-900">{prescriptions.length}</div>
              <div className="text-xs text-gray-500">Total Rx</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 text-center">
              <div className="text-xl font-bold text-red-600">
                {prescriptions.filter((p) => p.status === 'Refill Needed').length}
              </div>
              <div className="text-xs text-gray-500">Refill Needed</div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((rx) => (
            <div key={rx.rxId} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 text-xl flex-shrink-0">
                  💊
                </div>
                <span className={statusMap[rx.status] || 'badge-pending'}>{rx.status}</span>
              </div>

              <h3 className="font-bold text-gray-900 text-base">{rx.drugName}</h3>
              <p className="text-sm text-gray-500 mb-3">{rx.genericName} {rx.dosage}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Qty / Supply</span>
                  <span className="font-medium text-gray-800">{rx.quantity} / {rx.daysSupply} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Refills Remaining</span>
                  <span className={`font-bold ${rx.refillsRemaining === 0 ? 'text-red-600' : 'text-green-700'}`}>
                    {rx.refillsRemaining}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Filled</span>
                  <span className="text-gray-700">{new Date(rx.lastFilled).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Next Refill</span>
                  <span className="text-gray-700">{rx.nextRefillDate ? new Date(rx.nextRefillDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Copay</span>
                  <span className="font-bold text-blue-700">${rx.cost.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1">
                <div className="text-xs text-gray-500">Prescribed by: <span className="text-gray-700 font-medium">{rx.prescribedBy}</span></div>
                <div className="text-xs text-gray-500">Pharmacy: <span className="text-gray-700 font-medium">{rx.pharmacy}</span></div>
              </div>

              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${tierColors[rx.tier] || 'bg-gray-100 text-gray-600'}`}>
                  {rx.tier}
                </span>
              </div>

              {rx.status === 'Refill Needed' && (
                <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-700 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-blue-800 hover:to-teal-700 transition-all">
                  Request Refill
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center text-gray-400 text-sm py-12">
              No prescriptions found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pharmacy
