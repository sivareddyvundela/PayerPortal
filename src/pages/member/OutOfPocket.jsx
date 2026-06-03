import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberOutOfPocket } from '../../services/api.js'

function ProgressCard({ label, met, max, barColor, textColor, bgColor, icon }) {
  const pct = Math.min((met / max) * 100, 100)
  const remaining = Math.max(max - met, 0)
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center text-2xl`}>{icon}</div>
        <div>
          <h3 className="font-bold text-gray-900">{label}</h3>
          <p className="text-xs text-gray-500">Plan Year 2024</p>
        </div>
        <div className="ml-auto text-right">
          <div className={`text-2xl font-black ${textColor}`}>{pct.toFixed(0)}%</div>
          <div className="text-xs text-gray-400">Complete</div>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <div className="text-xs text-gray-500">Met</div>
          <div className={`font-bold ${textColor}`}>${met.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Remaining</div>
          <div className="font-bold text-gray-700">${remaining.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Maximum</div>
          <div className="font-bold text-gray-900">${max.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

function OutOfPocket() {
  const { currentUser } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    getMemberOutOfPocket(currentUser?.memberId).then(setData)
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Out-of-Pocket Summary</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your cost-sharing progress for plan year 2024</p>
        </div>

        {data && (
          <>
            {/* Individual progress */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-700 mb-3">Individual Accumulators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProgressCard
                  label="Individual Deductible"
                  met={data.individual.deductibleMet}
                  max={data.individual.deductibleMax}
                  textColor="text-blue-600"
                  barColor="bg-blue-500"
                  bgColor="bg-blue-100"
                  icon="🎯"
                />
                <ProgressCard
                  label="Individual Out-of-Pocket Max"
                  met={data.individual.oopMet}
                  max={data.individual.oopMax}
                  textColor="text-teal-600"
                  barColor="bg-teal-500"
                  bgColor="bg-teal-100"
                  icon="💳"
                />
              </div>
            </div>

            {/* Family progress */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-700 mb-3">Family Accumulators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProgressCard
                  label="Family Deductible"
                  met={data.family.deductibleMet}
                  max={data.family.deductibleMax}
                  textColor="text-indigo-600"
                  barColor="bg-indigo-500"
                  bgColor="bg-indigo-100"
                  icon="👨‍👩‍👧"
                />
                <ProgressCard
                  label="Family Out-of-Pocket Max"
                  met={data.family.oopMet}
                  max={data.family.oopMax}
                  textColor="text-purple-600"
                  barColor="bg-purple-500"
                  bgColor="bg-purple-100"
                  icon="🏠"
                />
              </div>
            </div>

            {/* Copay breakdown */}
            <div className="card mb-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Cost-Sharing Breakdown</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-green-700">${data.individual.coinsurancePaid.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-1">Coinsurance Paid</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-blue-700">${data.individual.copaysPaid.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-1">Copays Paid</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-gray-900">
                    ${(data.individual.oopMet).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total Out-of-Pocket</div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-700 mb-3">Copay History by Visit Type</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs text-gray-500 font-semibold uppercase">Type</th>
                      <th className="text-right py-2 px-3 text-xs text-gray-500 font-semibold uppercase">Visits</th>
                      <th className="text-right py-2 px-3 text-xs text-gray-500 font-semibold uppercase">Per Visit</th>
                      <th className="text-right py-2 px-3 text-xs text-gray-500 font-semibold uppercase">Total Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.copayHistory.map((row) => (
                      <tr key={row.type} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-gray-800">{row.type}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">{row.count}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">${row.amount.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-700">${row.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <strong>As of {new Date(data.asOfDate).toLocaleDateString()}.</strong> Amounts are updated within 5-7 business days of claim processing. Total amounts may not reflect all pending claims.
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OutOfPocket
