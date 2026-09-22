import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        'লগইন ব্যর্থ হয়েছে, আবার চেষ্টা করুন।'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-sm rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-1 text-center text-2xl font-bold text-brand'>
          Daily News BD
        </h1>
        <p className='mb-6 text-center text-sm text-gray-500'>
          অ্যাডমিন প্যানেল
        </p>

        {error && (
          <div className='mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>ইমেইল</label>
            <input
              type='email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              পাসওয়ার্ড
            </label>
            <input
              type='password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full rounded bg-brand py-2 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60'
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  )
}
