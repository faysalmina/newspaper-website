import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RichTextEditor from '../components/RichTextEditor'
import {
  createNews,
  updateNews,
  getSingleNews,
  getCategories,
  getTags
} from '../api/news'

export default function NewsForm () {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
    is_breaking: false,
    is_featured: false,
    meta_title: '',
    meta_description: '',
    tags: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))
    getTags().then(res => setAvailableTags(res.data))

    if (isEdit) {
      getSingleNews(id).then(res => {
        const n = res.data
        setForm({
          title: n.title,
          excerpt: n.excerpt || '',
          content: n.content || '',
          category_id: n.category_id,
          status: n.status,
          is_breaking: n.is_breaking,
          is_featured: n.is_featured,
          meta_title: n.meta_title || '',
          meta_description: n.meta_description || '',
          tags: (n.tags || []).map(t => t.name).join(', ')
        })
        setCurrentImage(n.featured_image)
      })
    }
  }, [id])

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
      if (key === 'tags') return
      fd.append(key, val === true ? '1' : val === false ? '0' : val)
    })
    form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(tag => fd.append('tags[]', tag))
    if (imageFile) fd.append('featured_image', imageFile)

    try {
      if (isEdit) await updateNews(id, fd)
      else await createNews(fd)
      navigate('/news')
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
    <div className='max-w-3xl'>
      <h1 className='mb-4 text-xl font-bold'>
        {isEdit ? 'নিউজ এডিট করুন' : 'নতুন নিউজ'}
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
          <label className='mb-1 block text-sm text-gray-700'>
            সংক্ষিপ্ত বিবরণ
          </label>
          <textarea
            name='excerpt'
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            className='w-full rounded border border-gray-300 px-3 py-2'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>
            বিস্তারিত *
          </label>
          <RichTextEditor
            value={form.content}
            onChange={html => setForm(f => ({ ...f, content: html }))}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-sm text-gray-700'>
              ক্যাটাগরি *
            </label>
            <select
              name='category_id'
              value={form.category_id}
              onChange={handleChange}
              required
              className='w-full rounded border border-gray-300 px-3 py-2'
            >
              <option value=''>নির্বাচন করুন</option>
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
              <option value='draft'>খসড়া (Draft)</option>
              <option value='published'>প্রকাশ করুন (Published)</option>
            </select>
          </div>
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>
            ট্যাগ (কমা দিয়ে আলাদা করুন)
          </label>
          <input
            name='tags'
            value={form.tags}
            onChange={handleChange}
            placeholder='যেমন: নির্বাচন, ঢাকা, ক্রিকেট'
            className='w-full rounded border border-gray-300 px-3 py-2'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-700'>
            ফিচার্ড ইমেজ
          </label>
          {currentImage && !imageFile && (
            <img
              src={`${import.meta.env.VITE_API_URL.replace(
                '/api',
                ''
              )}/storage/${currentImage}`}
              alt='current'
              className='mb-2 h-32 rounded object-cover'
            />
          )}
          <input
            type='file'
            accept='image/*'
            onChange={e => setImageFile(e.target.files[0])}
          />
        </div>

        <div className='flex gap-6'>
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              name='is_breaking'
              checked={form.is_breaking}
              onChange={handleChange}
            />
            ব্রেকিং নিউজ
          </label>
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              name='is_featured'
              checked={form.is_featured}
              onChange={handleChange}
            />
            ফিচার্ড
          </label>
        </div>

        <details className='rounded border p-3'>
          <summary className='cursor-pointer text-sm font-medium text-gray-700'>
            SEO সেটিংস (ঐচ্ছিক)
          </summary>
          <div className='mt-3 space-y-3'>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                Meta Title
              </label>
              <input
                name='meta_title'
                value={form.meta_title}
                onChange={handleChange}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                Meta Description
              </label>
              <textarea
                name='meta_description'
                value={form.meta_description}
                onChange={handleChange}
                rows={2}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
          </div>
        </details>

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
            onClick={() => navigate('/news')}
            className='rounded bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200'
          >
            বাতিল
          </button>
        </div>
      </form>
    </div>
  )
}
