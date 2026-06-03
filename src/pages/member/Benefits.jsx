import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberBenefits } from '../../services/api.js'

const tabIcons = { Medical: '🏥', Dental: '🦷', Vision: '👁️', 'Mental Health': '🧠' }
const tabColors = {
  Medical: 'from-blue-600 to-blue-800',
  Dental: 'from-cyan-600 to-cyan-800',
  Vision: 'from-indigo-600 to-indigo-800',
  'Mental Health': 'from-purple-600 to-purple-800',
}

function BenefitSection({ title, data, network }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${network === 'inNetwork' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
        {network === 'inNetwork' ? 'In-Network' : 'Out-of-Network'} Coverage
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
            <div>
              <div className="text-xs text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
              </div>
              <div className="text-sm font-semibold text-gray-800 mt-0.5">
                {typeof value === 'object' ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ') : value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Benefits() {
  const { currentUser } = useAuth()
  const [benefits, setBenefits] = useState(null)
  const [activeTab, setActiveTab] = useState('Medical')

  useEffect(() => {
    getMemberBenefits(currentUser?.memberId).then(setBenefits)
  }, [currentUser])

  const tabs = benefits ? Object.keys(benefits) : []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Benefits & Coverage</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your Gold PPO plan coverage details</p>
        </div>

        {benefits && (
          <>
            {/* Tab navigation */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? `bg-gradient-to-r ${tabColors[tab]} text-white shadow-md`
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span>{tabIcons[tab]}</span>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tabColors[activeTab]} flex items-center justify-center text-2xl shadow-md`}>
                  {tabIcons[activeTab]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{activeTab} Benefits</h2>
                  <p className="text-sm text-gray-500">Gold PPO — Plan Year 2024</p>
                </div>
              </div>

              <div className="space-y-8">
                {benefits[activeTab]?.inNetwork && (
                  <BenefitSection title={activeTab} data={benefits[activeTab].inNetwork} network="inNetwork" />
                )}
                {benefits[activeTab]?.outOfNetwork && Object.keys(benefits[activeTab].outOfNetwork).length > 0 && (
                  <BenefitSection title={activeTab} data={benefits[activeTab].outOfNetwork} network="outOfNetwork" />
                )}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                <strong>Important:</strong> Benefits and coverage details are subject to your plan terms and conditions. Always verify coverage before receiving services. Call member services at 1-800-HEALTH-1 for benefit verification.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Benefits
