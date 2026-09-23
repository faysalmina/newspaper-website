'use client'

import { useEffect, useState } from 'react'
import { getNewsComments, postComment, formatDate } from '../lib/api'

export default function CommentSection ({ slug }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    comment: '',
    website: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    getNewsComments(slug)
      .then(data => setComments(data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [slug])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const res = await postComment(slug, form)
      setMessage(res.message)
      setForm({ name: '', email: '', comment: '', website: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='mt-8 border-t pt-6'>
      <h2 className='mb-4 text-lg font-bold'>মন্তব্য ({comments.length})</h2>

      {!loading && comments.length > 0 && (
        <div className='mb-6 space-y-4'>
          {comments.map(c => (
            <div key={c.id} className='rounded border bg-gray-50 p-4'>
              <div className='flex items-center justify-between'>
                <p className='font-semibold text-sm'>{c.name}</p>
                <p className='text-xs text-gray-400'>
                  {formatDate(c.created_at)}
                </p>
              </div>
              <p className='mt-1 text-sm text-gray-700'>{c.comment}</p>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-3 rounded border bg-white p-4'
      >
        <h3 className='text-sm font-semibold text-gray-700'>মন্তব্য করুন</h3>

        {message && (
          <div className='rounded bg-green-50 px-3 py-2 text-sm text-green-700'>
            {message}
          </div>
        )}
        {error && (
          <div className='rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
            {error}
          </div>
        )}

        {/* honeypot — CSS দিয়ে লুকানো, শুধু বট এটাতে ভরবে */}
        <input
          type='text'
          name='website'
          value={form.website}
          onChange={e => setForm({ ...form, website: e.target.value })}
          className='absolute left-[-9999px]'
          tabIndex={-1}
          autoComplete='off'
        />

        <div className='grid grid-cols-2 gap-3'>
          <input
            required
            placeholder='আপনার নাম'
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className='rounded border border-gray-300 px-3 py-2 text-sm'
          />
          <input
            required
            type='email'
            placeholder='ইমেইল (প্রকাশিত হবে না)'
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className='rounded border border-gray-300 px-3 py-2 text-sm'
          />
        </div>
        <textarea
          required
          rows={3}
          placeholder='আপনার মন্তব্য লিখুন...'
          value={form.comment}
          onChange={e => setForm({ ...form, comment: e.target.value })}
          className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
        />
        <button
          type='submit'
          disabled={submitting}
          className='rounded bg-brand px-5 py-2 text-sm text-white hover:bg-brand-dark disabled:opacity-60'
        >
          {submitting ? 'জমা হচ্ছে...' : 'মন্তব্য জমা দিন'}
        </button>
      </form>
    </div>
  )
}
