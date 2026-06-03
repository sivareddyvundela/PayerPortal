import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import MemberSidebar from '../../components/member/MemberSidebar.jsx'
import { getMemberProfile } from '../../services/api.js'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide sm:w-44">{label}</span>
      <span className="text-sm text-gray-900 font-medium mt-0.5 sm:mt-0">{value || '—'}</span>
    </div>
  )
}

function MemberProfile() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getMemberProfile(currentUser?.memberId).then(setProfile)
  }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your personal and plan information</p>
        </div>

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar card */}
            <div className="card flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg">
                {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
              <p className="text-teal-600 font-semibold text-sm mt-1">{profile.plan}</p>
              <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                {profile.eligibilityStatus}
              </div>

              <div className="mt-6 w-full space-y-2 text-left">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Member ID</div>
                  <div className="text-sm font-bold text-blue-700">{profile.memberId}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Group Number</div>
                  <div className="text-sm font-semibold text-gray-800">{profile.groupNumber}</div>
                </div>
              </div>

              <button className="mt-6 w-full py-2 border-2 border-blue-700 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Edit Profile
              </button>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>👤</span> Personal Information
                </h3>
                <InfoRow label="Full Name" value={profile.name} />
                <InfoRow label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                <InfoRow label="Gender" value={profile.gender} />
                <InfoRow label="Phone" value={profile.phone} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Address" value={`${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}`} />
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🛡️</span> Plan Information
                </h3>
                <InfoRow label="Plan Name" value={profile.plan} />
                <InfoRow label="Member ID" value={profile.memberId} />
                <InfoRow label="Group Number" value={profile.groupNumber} />
                <InfoRow label="Subscriber ID" value={profile.subscriberId} />
                <InfoRow label="Relationship" value={profile.relationshipToSubscriber} />
                <InfoRow label="Effective Date" value={new Date(profile.planEffectiveDate).toLocaleDateString()} />
                <InfoRow label="Term Date" value={new Date(profile.planTermDate).toLocaleDateString()} />
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏥</span> Primary Care Physician
                </h3>
                <InfoRow label="Provider Name" value={profile.primaryCarePhysician} />
                <InfoRow label="Phone" value={profile.pcpPhone} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MemberProfile
