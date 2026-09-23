import { useEffect, useState } from 'react'
import { getEpapers, createEpaper, deleteEpaper } from '../api/epaper'
import { useAuth } from '../context/AuthContext'

export default function EpaperManagement () {
  const [epapers, setEpapers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ publish_date: '', title: '' })
  const [pdfFile, setPdfFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  const load = () => {
    setLoading(true)
    getEpapers()
      .then(res => setEpapers(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!pdfFile) {
      setError('PDF ফাইল আবশ্যক')
      return
    }
    setSaving(true)

    const fd = new FormData()
    fd.append('publish_date', form.publish_date)
    if (form.title) fd.append('title', form.title)
    fd.append('pdf_file', pdfFile)
    if (coverFile) fd.append('cover_image', coverFile)

    try {
      await createEpaper(fd)
      setForm({ publish_date: '', title: '' })
      setPdfFile(null)
      setCoverFile(null)
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

  const handleDelete = async ep => {
    if (!window.confirm(`${ep.publish_date} তারিখের ই-পেপার ডিলিট করবেন?`))
      return
    try {
      await deleteEpaper(ep.id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'ডিলিট করা যায়নি')
    }
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>ই-পেপার ম্যানেজমেন্ট</h1>

      <form
        onSubmit={handleSubmit}
        className='mb-6 space-y-4 rounded bg-white p-6 shadow'
      >
        <h2 className='font-semibold'>নতুন ই-পেপার আপলোড</h2>
        {error && (
          <div className='rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>তারিখ *</label>
            <input
              type='date'
              required
              value={form.publish_date}
              onChange={e => setForm({ ...form, publish_date: e.target.value })}
              className='w-full rounded border border-gray-300 px-3 py-2'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              শিরোনাম (ঐচ্ছিক)
            </label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder='না দিলে তারিখ থেকেই দেখাবে'
              className='w-full rounded border border-gray-300 px-3 py-2'
            />
          </div>
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>PDF ফাইল *</label>
          <input
            type='file'
            accept='application/pdf'
            onChange={e => setPdfFile(e.target.files[0])}
            required
          />
          <p className='mt-1 text-xs text-gray-400'>সর্বোচ্চ ২০MB</p>
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>
            কভার ছবি (ঐচ্ছিক থাম্বনেইল)
          </label>
          <input
            type='file'
            accept='image/*'
            onChange={e => setCoverFile(e.target.files[0])}
          />
        </div>

        <button
          type='submit'
          disabled={saving}
          className='rounded bg-brand px-6 py-2 text-white hover:bg-brand-dark disabled:opacity-60'
        >
          {saving ? 'আপলোড হচ্ছে...' : 'আপলোড করুন'}
        </button>
      </form>

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>তারিখ</th>
              <th className='p-3'>শিরোনাম</th>
              <th className='p-3'>আপলোডকারী</th>
              <th className='p-3'>ডাউনলোড সংখ্যা</th>
              <th className='p-3'>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {epapers.data.length === 0 && (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  কোনো ই-পেপার নেই
                </td>
              </tr>
            )}
            {epapers.data.map(ep => (
              <tr key={ep.id} className='border-b last:border-0'>
                <td className='p-3'>{ep.publish_date}</td>
                <td className='p-3'>{ep.title || '—'}</td>
                <td className='p-3'>{ep.uploader?.name}</td>
                <td className='p-3'>{ep.downloads_count}</td>
                <td className='p-3'>
                  {(user?.role === 'super_admin' ||
                    ep.uploaded_by === user?.id) && (
                    <button
                      onClick={() => handleDelete(ep)}
                      className='text-red-600 hover:underline'
                    >
                      ডিলিট
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
