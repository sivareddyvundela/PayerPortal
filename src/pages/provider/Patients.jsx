import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import ProviderSidebar from '../../components/provider/ProviderSidebar.jsx'
import { getProviderPatients } from '../../services/api.js'

const planColors = {
  'Gold PPO': 'bg-yellow-100 text-yellow-800',
  'Silver HMO': 'bg-gray-100 text-gray-700',
  'Platinum PPO': 'bg-purple-100 text-purple-700',
  'Bronze HSA': 'bg-orange-100 text-orange-700',
  'Medicare Advantage': 'bg-blue-100 text-blue-700',
}

function Patients() {
  const { currentUser } = useAuth()
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    getProviderPatients(currentUser?.npi).then(setPatients)
  }, [currentUser])

  const filtered = patients.filter((p) => {
    const matchStatus = filterStatus === 'All' || p.status === filterStatus
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.memberId.toLowerCase().includes(search.toLowerCase()) ||
      p.plan.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-500 text-sm mt-0.5">HealthBridge members under your care</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {['All', 'Active', 'Inactive'].map((s) => {
            const count = s === 'All' ? patients.length : patients.filter((p) => p.status === s).length
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
            placeholder="Search patients..."
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
                  {['Patient Name', 'Member ID', 'Date of Birth', 'Plan', 'Last Visit', 'Next Visit', 'Eligibility', 'Status'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.patientId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-700">{p.memberId}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${planColors[p.plan] || 'bg-gray-100 text-gray-600'}`}>
                        {p.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(p.lastVisit).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{p.nextVisit ? new Date(p.nextVisit).toLocaleDateString() : '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        p.eligibilityStatus === 'Eligible' ? 'badge-paid' : 'badge-denied'
                      }`}>
                        {p.eligibilityStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        p.status === 'Active' ? 'badge-active' : 'bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Showing {filtered.length} of {patients.length} patients
          </div>
        </div>
      </div>
    </div>
  )
}

export default Patients
