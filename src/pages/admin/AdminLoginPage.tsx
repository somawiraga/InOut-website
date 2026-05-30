import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabaseClient'
import inoutLogo from '../../assets/companies/inout-logo.png'
import '../../styles/admin.css'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      toast.error('Login failed')
    } else {
      toast.success('Signed in successfully')
      navigate('/admin/products')
    }

    setLoading(false)
  }

  return (
    <div className="admin-login-root">
      <div className="admin-login-card">
        <img src={inoutLogo} alt="InOut" className="admin-login-logo-img" />
        <div className="admin-login-tagline">Sign in to manage product data</div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="admin-login-label">Email</label>
          <input
            className="admin-login-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoFocus
          />

          <label className="admin-login-label">Password</label>
          <input
            className="admin-login-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button className="admin-login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
