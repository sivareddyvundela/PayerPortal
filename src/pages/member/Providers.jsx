import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberProviders } from '../../services/api.js'

function Providers() {
  const { currentUser } = useAuth()
  const [providers, setProviders] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMemberProviders(currentUser?.memberId).then(setProviders)
  }, [currentUser])

  const filtered = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Providers</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your care team and in-network providers</p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm text-gray-600">{providers.length} providers in your care team</p>
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((provider) => (
            <div key={provider.providerId} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                  {provider.role === 'Primary Care Physician' ? '⭐' : '🩺'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{provider.name}</h3>
                  <p className="text-sm text-teal-600 font-medium">{provider.specialty}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-1 ${
                    provider.role === 'Primary Care Physician'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {provider.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">📞</span>
                  <span className="text-gray-700">{provider.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-gray-400 mt-0.5">📍</span>
                  <span className="text-gray-700 text-xs leading-relaxed">{provider.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">🗓️</span>
                  <span className="text-gray-700 text-xs">
                    Next available: {provider.nextAvailable ? new Date(provider.nextAvailable).toLocaleDateString() : 'Call to schedule'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${provider.networkStatus === 'In-Network' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                  <span className="text-xs font-semibold text-gray-600">{provider.networkStatus}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  provider.acceptingNewPatients
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {provider.acceptingNewPatients ? 'Accepting Patients' : 'Not Accepting'}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center text-gray-400 py-12">No providers found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Providers
