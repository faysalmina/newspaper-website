import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../api/auth'

export default function ResetPassword () {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirm
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'সমস্যা হয়েছে।'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
        <div className='w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-md'>
          <p className='text-red-600'>অবৈধ রিসেট লিংক।</p>
          <Link
            to='/forgot-password'
            className='mt-3 inline-block text-sm text-blue-600 hover:underline'
          >
            আবার রিকোয়েস্ট করুন
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-sm rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-6 text-center text-2xl font-bold text-brand'>
          নতুন পাসওয়ার্ড সেট করুন
        </h1>

        {success ? (
          <div className='rounded bg-green-50 px-3 py-3 text-center text-sm text-green-700'>
            ✅ পাসওয়ার্ড পরিবর্তন হয়েছে! লগইন পেজে নিয়ে যাওয়া হচ্ছে...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
                {error}
              </div>
            )}

            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                নতুন পাসওয়ার্ড
              </label>
              <input
                type='password'
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                পাসওয়ার্ড আবার লিখুন
              </label>
              <input
                type='password'
                required
                minLength={8}
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded bg-brand py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60'
            >
              {loading ? 'সেভ হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
