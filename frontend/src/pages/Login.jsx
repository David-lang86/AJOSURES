import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { showSuccess, showError } from '../lib/toast'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      showError(error.message)
      setLoading(false)
      return
    }

    showSuccess('Login successful! Welcome back.')
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

        <p className="text-gray-500 mt-2">Login to AJOSURES</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <div className="text-right">
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 font-semibold ml-2">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login