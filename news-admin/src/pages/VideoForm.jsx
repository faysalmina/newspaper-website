import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createVideo, updateVideo, getSingleVideo } from '../api/video'
import { getCategories } from '../api/category'

export default function VideoForm () {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_type: 'youtube',
    video_url: '',
    category_id: '',
    status: 'draft'
  })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))

    if (isEdit) {
      getSingleVideo(id).then(res => {
        const v = res.data
        setForm({
          title: v.title,
          description: v.description || '',
          video_type: v.video_type,
          video_url: v.video_url || '',
          category_id: v.category_id || '',
          status: v.status
        })
        setCurrentThumbnail(v.thumbnail)
      })
    }
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => fd.append(key, val))
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile)
    if (videoFile) fd.append('video_file', videoFile)

    try {
      if (isEdit) await updateVideo(id, fd)
      else await createVideo(fd)
      navigate('/videos')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'সেভ করতে সমস্যা হয়েছে।'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-2xl'>
      <h1 className='mb-4 text-xl font-bold'>
        {isEdit ? 'ভিডিও এডিট করুন' : 'নতুন ভিডিও পোস্ট'}
      </h1>
      {error && (
        <div className='mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-4 rounded bg-white p-6 shadow'
      >
        <div>
          <label className='mb-1 block text-sm text-gray-700'>শিরোনাম *</label>
          <input
            name='title'
            value={form.title}
            onChange={handleChange}
            required
            className='w-full rounded border border-gray-300 px-3 py-2'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>বিবরণ</label>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            rows={3}
            className='w-full rounded border border-gray-300 px-3 py-2'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>
            ভিডিও উৎস *
          </label>
          <select
            name='video_type'
            value={form.video_type}
            onChange={handleChange}
            className='w-full rounded border border-gray-300 px-3 py-2'
          >
            <option value='youtube'>YouTube লিংক</option>
            <option value='upload'>ফাইল আপলোড</option>
          </select>
        </div>

        {form.video_type === 'youtube' ? (
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              YouTube URL *
            </label>
            <input
              name='video_url'
              value={form.video_url}
              onChange={handleChange}
              placeholder='https://www.youtube.com/watch?v=...'
              required={form.video_type === 'youtube'}
              className='w-full rounded border border-gray-300 px-3 py-2'
            />
          </div>
        ) : (
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              ভিডিও ফাইল {isEdit ? '(পরিবর্তন না করলে খালি রাখুন)' : '*'}
            </label>
            <input
              type='file'
              accept='video/mp4,video/quicktime,video/webm'
              onChange={e => setVideoFile(e.target.files[0])}
              required={!isEdit && form.video_type === 'upload'}
            />
            <p className='mt-1 text-xs text-gray-400'>
              সর্বোচ্চ ৫০MB, MP4/MOV/WebM ফরম্যাট
            </p>
          </div>
        )}

        <div>
          <label className='mb-1 block text-sm text-gray-700'>
            থাম্বনেইল ছবি
          </label>
          {currentThumbnail && !thumbnailFile && (
            <img
              src={`${import.meta.env.VITE_API_URL.replace(
                '/api',
                ''
              )}/storage/${currentThumbnail}`}
              alt='current'
              className='mb-2 h-24 rounded object-cover'
            />
          )}
          <input
            type='file'
            accept='image/*'
            onChange={e => setThumbnailFile(e.target.files[0])}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              ক্যাটাগরি
            </label>
            <select
              name='category_id'
              value={form.category_id}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
            >
              <option value=''>নির্বাচন করুন (ঐচ্ছিক)</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              স্ট্যাটাস
            </label>
            <select
              name='status'
              value={form.status}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
            >
              <option value='draft'>খসড়া</option>
              <option value='published'>প্রকাশ করুন</option>
            </select>
          </div>
        </div>

        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={saving}
            className='rounded bg-brand px-6 py-2 text-white hover:bg-brand-dark disabled:opacity-60'
          >
            {saving ? 'সেভ হচ্ছে...' : isEdit ? 'আপডেট করুন' : 'পাবলিশ করুন'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/videos')}
            className='rounded bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200'
          >
            বাতিল
          </button>
        </div>
      </form>
    </div>
  )
}
