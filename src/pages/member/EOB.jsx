import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberEOB } from '../../services/api.js'

function EOBRow({ eob }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
            EOB
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{eob.serviceDescription}</div>
            <div className="text-xs text-gray-500 mt-0.5">{eob.provider} · {new Date(eob.serviceDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-6 ml-4">
          <div className="hidden sm:block text-right">
            <div className="text-xs text-gray-400">Billed</div>
            <div className="text-sm font-semibold text-gray-800">${eob.billedAmount.toFixed(2)}</div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs text-gray-400">Plan Paid</div>
            <div className="text-sm font-semibold text-green-700">${eob.planPaid.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Your Cost</div>
            <div className="text-sm font-bold text-blue-700">${eob.memberResponsibility.toFixed(2)}</div>
          </div>
          <span className="text-gray-400 text-lg ml-2">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Billed Amount', value: `$${eob.billedAmount.toFixed(2)}`, color: 'text-gray-800' },
              { label: 'Contractual Adj.', value: `-$${eob.contractualAdjustment.toFixed(2)}`, color: 'text-red-600' },
              { label: 'Allowed Amount', value: `$${eob.allowedAmount.toFixed(2)}`, color: 'text-gray-800' },
              { label: 'Plan Paid', value: `$${eob.planPaid.toFixed(2)}`, color: 'text-green-700 font-bold' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-lg p-3 border border-gray-100 text-center">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className={`text-base font-semibold ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Deductible Applied', value: `$${eob.deductibleApplied.toFixed(2)}` },
              { label: 'Copay', value: `$${eob.copayAmount.toFixed(2)}` },
              { label: 'Coinsurance', value: `$${eob.coinsuranceAmount.toFixed(2)}` },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-sm font-semibold text-blue-700">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 flex-shrink-0">ℹ️</span>
              <div>
                <div className="text-xs font-semibold text-blue-800 mb-1">Processing Notes</div>
                <p className="text-xs text-blue-700">{eob.notes}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>EOB ID: <span className="font-mono">{eob.eobId}</span></span>
            <span>Processed: {new Date(eob.dateProcessed).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function EOB() {
  const { currentUser } = useAuth()
  const [eobs, setEobs] = useState([])

  useEffect(() => {
    getMemberEOB(currentUser?.memberId).then(setEobs)
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Explanation of Benefits</h1>
          <p className="text-gray-500 text-sm mt-0.5">Detailed breakdown of how your claims were processed</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{eobs.length}</div>
            <div className="text-sm text-gray-500">Total EOBs</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-700">
              ${eobs.reduce((s, e) => s + e.planPaid, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Total Plan Paid</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-700">
              ${eobs.reduce((s, e) => s + e.memberResponsibility, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Your Total Cost</div>
          </div>
        </div>

        <div>
          {eobs.map((eob) => (
            <EOBRow key={eob.eobId} eob={eob} />
          ))}
          {eobs.length === 0 && (
            <div className="card text-center text-gray-400 py-12">
              No EOBs available at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EOB
