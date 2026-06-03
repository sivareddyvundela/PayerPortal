import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import ProviderSidebar from '../../components/provider/ProviderSidebar.jsx'
import { getProviderProfile } from '../../services/api.js'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide sm:w-48">{label}</span>
      <span className="text-sm text-gray-900 font-medium mt-0.5 sm:mt-0">{value || '—'}</span>
    </div>
  )
}

function ProviderProfile() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getProviderProfile(currentUser?.npi).then(setProfile)
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your professional information on file with HealthBridge</p>
        </div>

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar card */}
            <div className="card flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg">
                👨‍⚕️
              </div>
              <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.credentials}</p>
              <p className="text-teal-600 font-semibold text-sm mt-1">{profile.specialty}</p>

              <div className="mt-6 w-full space-y-2 text-left">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">NPI Number</div>
                  <div className="text-sm font-bold text-blue-700 font-mono">{profile.npi}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Tax ID</div>
                  <div className="text-sm font-semibold text-gray-800 font-mono">{profile.taxId}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">DEA Number</div>
                  <div className="text-sm font-semibold text-gray-800 font-mono">{profile.deaNumber}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  profile.acceptingNewPatients ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {profile.acceptingNewPatients ? 'Accepting Patients' : 'Not Accepting'}
                </span>
                <span className="text-xs px-2 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
                  {profile.networkStatus}
                </span>
                {profile.boardCertified && (
                  <span className="text-xs px-2 py-1 rounded-full font-semibold bg-teal-100 text-teal-700">
                    Board Certified
                  </span>
                )}
              </div>

              <button className="mt-6 w-full py-2 border-2 border-blue-700 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Edit Profile
              </button>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>👤</span> Professional Information
                </h3>
                <InfoRow label="Full Name" value={`${profile.name}, ${profile.credentials}`} />
                <InfoRow label="Specialty" value={profile.specialty} />
                <InfoRow label="Sub-Specialty" value={profile.subSpecialty} />
                <InfoRow label="Group Name" value={profile.groupName} />
                <InfoRow label="Group NPI" value={profile.groupNPI} />
                <InfoRow label="Board Certification" value={profile.boardCertified ? profile.boardName : 'Not Board Certified'} />
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📍</span> Contact & Address
                </h3>
                <InfoRow label="Phone" value={profile.phone} />
                <InfoRow label="Fax" value={profile.fax} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Practice Address" value={`${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}`} />
                <InfoRow label="Billing Address" value={`${profile.billingAddress.street}, ${profile.billingAddress.city}, ${profile.billingAddress.state} ${profile.billingAddress.zip}`} />
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📋</span> Licensure & Credentials
                </h3>
                <InfoRow label="License Number" value={profile.licenseNumber} />
                <InfoRow label="License State" value={profile.licenseState} />
                <InfoRow label="License Expiry" value={new Date(profile.licenseExpiry).toLocaleDateString()} />
                <InfoRow label="Network Effective" value={new Date(profile.effectiveDate).toLocaleDateString()} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderProfile
