import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '../../api/setting'

const fields = [
  { key: 'site_name', label: 'সাইটের নাম' },
  { key: 'site_tagline', label: 'ট্যাগলাইন' },
  { key: 'footer_text', label: 'ফুটার টেক্সট', textarea: true },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'twitter_url', label: 'Twitter/X URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
  { key: 'google_analytics_id', label: 'Google Analytics ID' },
  { key: 'contact_email', label: 'যোগাযোগ ইমেইল' },
  { key: 'contact_phone', label: 'যোগাযোগ ফোন' }
]

export default function SiteSettings () {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getSettings()
      .then(res => setForm(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await updateSettings(form)
      setMessage('✅ সেটিংস সেভ হয়েছে')
    } catch {
      setMessage('❌ সেভ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>

  return (
    <div className='max-w-2xl'>
      <h1 className='mb-4 text-xl font-bold'>সাইট সেটিংস</h1>

      {message && (
        <div className='mb-4 rounded bg-gray-50 px-3 py-2 text-sm'>
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-4 rounded bg-white p-6 shadow'
      >
        {fields.map(f => (
          <div key={f.key}>
            <label className='mb-1 block text-sm text-gray-700'>
              {f.label}
            </label>
            {f.textarea ? (
              <textarea
                rows={2}
                value={form[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            ) : (
              <input
                value={form[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            )}
          </div>
        ))}

        <button
          type='submit'
          disabled={saving}
          className='rounded bg-brand px-6 py-2 text-white hover:bg-brand-dark disabled:opacity-60'
        >
          {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
        </button>
      </form>
    </div>
  )
}
