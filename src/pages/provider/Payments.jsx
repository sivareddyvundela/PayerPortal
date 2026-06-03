import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import ProviderSidebar from '../../components/provider/ProviderSidebar.jsx'
import { getProviderPayments } from '../../services/api.js'

const methodColors = {
  EFT: 'bg-teal-100 text-teal-700',
  Check: 'bg-blue-100 text-blue-700',
}

function Payments() {
  const { currentUser } = useAuth()
  const [payments, setPayments] = useState([])

  useEffect(() => {
    getProviderPayments(currentUser?.npi).then(setPayments)
  }, [currentUser])

  const totalReceived = payments.reduce((s, p) => s + p.totalAmount, 0)
  const totalClaims = payments.reduce((s, p) => s + p.claimsCount, 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Electronic Remittance Advices (ERA) and payment history</p>
        </div>

        {/* Summary card */}
        <div className="card mb-6 bg-gradient-to-r from-blue-700 to-teal-600 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-blue-200 font-medium mb-1">Total Received (YTD)</div>
              <div className="text-4xl font-black">${totalReceived.toLocaleString()}</div>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="text-sm text-blue-200">Payments</div>
                <div className="text-2xl font-bold">{payments.length}</div>
              </div>
              <div>
                <div className="text-sm text-blue-200">Claims Paid</div>
                <div className="text-2xl font-bold">{totalClaims}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['ERA Number', 'Check / EFT Ref', 'Payment Date', 'Method', 'Claims', 'Total Amount', 'Status'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.eraNumber} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-700 font-semibold">{p.eraNumber}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{p.checkNumber}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${methodColors[p.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 text-center font-medium">{p.claimsCount}</td>
                    <td className="py-3 px-4 font-bold text-green-700 text-lg">${p.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="badge-paid">{p.status}</span>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Showing {payments.length} payment records
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
          <strong>Note:</strong> EFT payments are deposited within 1-2 business days of the ERA date. For payment disputes, contact HealthBridge Provider Relations at 1-800-HEALTH-2.
        </div>
      </div>
    </div>
  )
}

export default Payments
