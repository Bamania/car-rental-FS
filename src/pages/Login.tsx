import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        { formData },
        { withCredentials: true }
      )
      console.log('Login successful:', response)
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#18191C] text-white flex items-center justify-center font-mono">
      <div className="w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 font-mono">Welcome Back</h1>
          <p className="text-gray-400 font-mono">Sign in to your DriveGo account</p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#232428] border-none">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm font-mono">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-[#18191C] border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white font-mono placeholder:font-mono"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 font-mono">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-[#18191C] border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white font-mono placeholder:font-mono"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center font-mono">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-400 font-mono">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 font-mono"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors font-mono"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center font-mono">
              <p className="text-gray-400 font-mono">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium font-mono">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg font-mono">
              <p className="text-yellow-400 text-sm font-medium mb-1 font-mono">Demo Credentials:</p>
              <p className="text-yellow-300 text-xs font-mono">Email: demo@example.com</p>
              <p className="text-yellow-300 text-xs font-mono">Password: demo123</p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6 font-mono">
          <Link to="/" className="text-gray-400 hover:text-white text-sm font-mono">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
