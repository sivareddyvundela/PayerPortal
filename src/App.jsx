import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import AgentforceChat from './components/member/AgentforceChat.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'

// Member pages
import MemberDashboard from './pages/member/MemberDashboard.jsx'
import MemberProfile from './pages/member/MemberProfile.jsx'
import Claims from './pages/member/Claims.jsx'
import EOB from './pages/member/EOB.jsx'
import Benefits from './pages/member/Benefits.jsx'
import Pharmacy from './pages/member/Pharmacy.jsx'
import Referrals from './pages/member/Referrals.jsx'
import Providers from './pages/member/Providers.jsx'
import OutOfPocket from './pages/member/OutOfPocket.jsx'

// Provider pages
import ProviderDashboard from './pages/provider/ProviderDashboard.jsx'
import ProviderProfile from './pages/provider/ProviderProfile.jsx'
import Patients from './pages/provider/Patients.jsx'
import ProviderClaims from './pages/provider/ProviderClaims.jsx'
import Payments from './pages/provider/Payments.jsx'

function App() {
  const { isAuthenticated, currentUser } = useAuth()

  return (
    <>
    {isAuthenticated && currentUser?.type === 'member' && <AgentforceChat />}
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Member protected routes */}
      <Route path="/member/dashboard" element={
        <ProtectedRoute requiredType="member"><MemberDashboard /></ProtectedRoute>
      } />
      <Route path="/member/profile" element={
        <ProtectedRoute requiredType="member"><MemberProfile /></ProtectedRoute>
      } />
      <Route path="/member/claims" element={
        <ProtectedRoute requiredType="member"><Claims /></ProtectedRoute>
      } />
      <Route path="/member/eob" element={
        <ProtectedRoute requiredType="member"><EOB /></ProtectedRoute>
      } />
      {/* <Route path="/member/benefits" element={
        <ProtectedRoute requiredType="member"><Benefits /></ProtectedRoute>
      } /> */}
      <Route path="/member/pharmacy" element={
        <ProtectedRoute requiredType="member"><Pharmacy /></ProtectedRoute>
      } />
      <Route path="/member/referrals" element={
        <ProtectedRoute requiredType="member"><Referrals /></ProtectedRoute>
      } />
      <Route path="/member/providers" element={
        <ProtectedRoute requiredType="member"><Providers /></ProtectedRoute>
      } />
      {/* <Route path="/member/out-of-pocket" element={
        <ProtectedRoute requiredType="member"><OutOfPocket /></ProtectedRoute>
      } /> */}

      {/* Provider protected routes */}
      <Route path="/provider/dashboard" element={
        <ProtectedRoute requiredType="provider"><ProviderDashboard /></ProtectedRoute>
      } />
      <Route path="/provider/profile" element={
        <ProtectedRoute requiredType="provider"><ProviderProfile /></ProtectedRoute>
      } />
      <Route path="/provider/patients" element={
        <ProtectedRoute requiredType="provider"><Patients /></ProtectedRoute>
      } />
      <Route path="/provider/claims" element={
        <ProtectedRoute requiredType="provider"><ProviderClaims /></ProtectedRoute>
      } />
      <Route path="/provider/payments" element={
        <ProtectedRoute requiredType="provider"><Payments /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default App
