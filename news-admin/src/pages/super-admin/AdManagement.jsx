import { useEffect, useState } from 'react'
import {
  getAds,
  createAd,
  updateAd,
  toggleAdActive,
  deleteAd
} from '../../api/ad'

const positionLabels = {
  header: 'হেডার (উপরে)',
  homepage_top: 'হোমপেজ — সবার উপরে',
  sidebar: 'সাইডবার',
  in_article: 'নিউজের মাঝখানে',
  footer: 'ফুটার'
}

const emptyForm = {
  title: '',
  ad_type: 'image',
  video_url: '',
  target_url: '',
  position: 'sidebar',
  width: 300,
  height: 250,
  is_active: true,
  start_date: '',
  end_date: '',
  order: 0
}

export default function AdManagement () {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getAds()
      .then(res => setAds(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setImageFile(null)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = ad => {
    setForm({
      title: ad.title,
      ad_type: ad.ad_type,
      video_url: ad.video_url || '',
      target_url: ad.target_url || '',
      position: ad.position,
      width: ad.width || '',
      height: ad.height || '',
      is_active: ad.is_active,
      start_date: ad.start_date || '',
      end_date: ad.end_date || '',
      order: ad.order
    })
    setEditingId(ad.id)
    setShowForm(true)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (val === '' || val === null) return
      fd.append(key, val === true ? '1' : val === false ? '0' : val)
    })
    if (imageFile) fd.append('image', imageFile)

    try {
      if (editingId) await updateAd(editingId, fd)
      else await createAd(fd)
      resetForm()
      load()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'সমস্যা হয়েছে।'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async ad => {
    await toggleAdActive(ad.id)
    load()
  }

  const handleDelete = async ad => {
    if (!window.confirm(`"${ad.title}" বিজ্ঞাপনটি ডিলিট করবেন?`)) return
    await deleteAd(ad.id)
    load()
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>বিজ্ঞাপন ম্যানেজমেন্ট</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className='rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark'
        >
          + নতুন বিজ্ঞাপন
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='mb-6 space-y-4 rounded bg-white p-6 shadow'
        >
          <h2 className='font-semibold'>
            {editingId ? 'বিজ্ঞাপন এডিট করুন' : 'নতুন বিজ্ঞাপন'}
          </h2>
          {error && (
            <div className='rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
              {error}
            </div>
          )}

          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              শিরোনাম (শুধু নিজের চেনার জন্য) *
            </label>
            <input
              name='title'
              value={form.title}
              onChange={handleChange}
              required
              className='w-full rounded border border-gray-300 px-3 py-2'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>টাইপ *</label>
              <select
                name='ad_type'
                value={form.ad_type}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              >
                <option value='image'>ছবি</option>
                <option value='video'>ভিডিও (YouTube/লিংক)</option>
              </select>
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                পজিশন *
              </label>
              <select
                name='position'
                value={form.position}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              >
                {Object.entries(positionLabels).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.ad_type === 'image' ? (
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                ছবি {editingId ? '(পরিবর্তন না করলে খালি রাখুন)' : '*'}
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={e => setImageFile(e.target.files[0])}
                required={!editingId}
              />
            </div>
          ) : (
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                ভিডিও URL *
              </label>
              <input
                name='video_url'
                value={form.video_url}
                onChange={handleChange}
                placeholder='https://www.youtube.com/watch?v=...'
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
          )}

          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              টার্গেট লিংক (ক্লিক করলে যেখানে যাবে)
            </label>
            <input
              name='target_url'
              value={form.target_url}
              onChange={handleChange}
              placeholder='https://example.com'
              className='w-full rounded border border-gray-300 px-3 py-2'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                প্রস্থ (px)
              </label>
              <input
                type='number'
                name='width'
                value={form.width}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                উচ্চতা (px)
              </label>
              <input
                type='number'
                name='height'
                value={form.height}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                শুরুর তারিখ (ঐচ্ছিক)
              </label>
              <input
                type='date'
                name='start_date'
                value={form.start_date}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                শেষের তারিখ (ঐচ্ছিক)
              </label>
              <input
                type='date'
                name='end_date'
                value={form.end_date}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
          </div>

          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              name='is_active'
              checked={form.is_active}
              onChange={handleChange}
            />
            এখনই সক্রিয় থাকবে
          </label>

          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={saving}
              className='rounded bg-brand px-6 py-2 text-white hover:bg-brand-dark disabled:opacity-60'
            >
              {saving ? 'সেভ হচ্ছে...' : editingId ? 'আপডেট করুন' : 'তৈরি করুন'}
            </button>
            <button
              type='button'
              onClick={resetForm}
              className='rounded bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200'
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>শিরোনাম</th>
              <th className='p-3'>পজিশন</th>
              <th className='p-3'>ইম্প্রেশন</th>
              <th className='p-3'>ক্লিক</th>
              <th className='p-3'>স্ট্যাটাস</th>
              <th className='p-3'>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 && (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-400'>
                  কোনো বিজ্ঞাপন নেই
                </td>
              </tr>
            )}
            {ads.map(ad => (
              <tr key={ad.id} className='border-b last:border-0'>
                <td className='p-3'>{ad.title}</td>
                <td className='p-3'>{positionLabels[ad.position]}</td>
                <td className='p-3'>{ad.impressions_count}</td>
                <td className='p-3'>{ad.clicks_count}</td>
                <td className='p-3'>
                  <button
                    onClick={() => handleToggle(ad)}
                    className={`rounded px-2 py-0.5 text-xs ${
                      ad.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {ad.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </button>
                </td>
                <td className='p-3'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(ad)}
                      className='text-blue-600 hover:underline'
                    >
                      এডিট
                    </button>
                    <button
                      onClick={() => handleDelete(ad)}
                      className='text-red-600 hover:underline'
                    >
                      ডিলিট
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
