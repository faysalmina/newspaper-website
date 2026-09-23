import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword () {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      setMessage(res.data.message)
    } catch (err) {
      setError(
        err.response?.data?.message || 'সমস্যা হয়েছে, আবার চেষ্টা করুন।'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-sm rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-1 text-center text-2xl font-bold text-brand'>
          পাসওয়ার্ড ভুলে গেছেন?
        </h1>
        <p className='mb-6 text-center text-sm text-gray-500'>
          আপনার ইমেইলে একটা রিসেট লিংক পাঠানো হবে
        </p>

        {message && (
          <div className='mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700'>
            {message}
          </div>
        )}
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
          <button
            type='submit'
            disabled={loading}
            className='w-full rounded bg-brand py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60'
          >
            {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
          </button>
        </form>

        <p className='mt-4 text-center text-sm'>
          <Link to='/login' className='text-blue-600 hover:underline'>
            লগইন পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  )
}
