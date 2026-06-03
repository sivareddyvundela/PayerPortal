import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const [userType, setUserType] = useState('member')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', memberId: '', npi: '',
    dob: '', password: '', confirmPassword: '', terms: false,
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    if (userType === 'member' && !form.memberId.trim()) errs.memberId = 'Required'
    if (userType === 'provider' && !form.npi.trim()) errs.npi = 'Required'
    if (!form.dob) errs.dob = 'Required'
    if (!form.password || form.password.length < 8) errs.password = 'Min 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.terms) errs.terms = 'You must accept terms'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-teal-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your {userType} account has been created. Please check your email for verification instructions.
          </p>
          <Link to="/login" className="inline-block w-full py-3 bg-gradient-to-r from-blue-700 to-teal-600 text-white font-semibold rounded-xl text-center hover:from-blue-800 hover:to-teal-700 transition-all">
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-black text-white">HealthBridge</Link>
          <p className="text-teal-300 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">New User Registration</h2>

          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            {['member', 'provider'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => { setUserType(type); setErrors({}) }}
                className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-all ${
                  userType === type
                    ? 'bg-gradient-to-r from-blue-700 to-teal-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type === 'member' ? 'I am a Member' : 'I am a Provider'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {field('First Name', 'firstName', 'text', 'John')}
              {field('Last Name', 'lastName', 'text', 'Smith')}
            </div>
            {field('Email Address', 'email', 'email', 'you@example.com')}
            {userType === 'member'
              ? field('Member ID', 'memberId', 'text', 'HB-2024-XXXXX')
              : field('NPI Number', 'npi', 'text', '1234567890')
            }
            {field('Date of Birth', 'dob', 'date')}
            {field('Create Password', 'password', 'password', 'Min 8 characters')}
            {field('Confirm Password', 'confirmPassword', 'password', 'Re-enter password')}

            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={form.terms}
                onChange={set('terms')}
                className="mt-0.5 accent-blue-700"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 underline">Terms of Use</a> and{' '}
                <a href="#" className="text-blue-600 underline">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-semibold rounded-xl transition-all shadow-md"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
