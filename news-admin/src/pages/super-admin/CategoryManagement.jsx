import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../api/category'

export default function CategoryManagement () {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getCategories()
      .then(res => setCategories(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateCategory(editingId, { name })
      } else {
        await createCategory({ name })
      }
      setName('')
      setEditingId(null)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'সমস্যা হয়েছে')
    }
  }

  const handleEdit = cat => {
    setName(cat.name)
    setEditingId(cat.id)
  }

  const handleDelete = async cat => {
    if (!window.confirm(`"${cat.name}" ক্যাটাগরি ডিলিট করবেন?`)) return
    try {
      await deleteCategory(cat.id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'ডিলিট করা যায়নি')
    }
  }

  const toggleActive = async cat => {
    await updateCategory(cat.id, { is_active: !cat.is_active })
    load()
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>ক্যাটাগরি ম্যানেজমেন্ট</h1>

      <form
        onSubmit={handleSubmit}
        className='mb-6 flex gap-3 rounded bg-white p-4 shadow'
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder='ক্যাটাগরির নাম (যেমন: প্রযুক্তি)'
          className='flex-1 rounded border border-gray-300 px-3 py-2'
        />
        <button
          type='submit'
          className='rounded bg-brand px-6 py-2 text-white hover:bg-brand-dark'
        >
          {editingId ? 'আপডেট করুন' : '+ যোগ করুন'}
        </button>
        {editingId && (
          <button
            type='button'
            onClick={() => {
              setEditingId(null)
              setName('')
            }}
            className='rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200'
          >
            বাতিল
          </button>
        )}
      </form>
      {error && (
        <div className='mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
          {error}
        </div>
      )}

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>নাম</th>
              <th className='p-3'>নিউজ সংখ্যা</th>
              <th className='p-3'>স্ট্যাটাস</th>
              <th className='p-3'>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className='border-b last:border-0'>
                <td className='p-3'>{cat.name}</td>
                <td className='p-3'>{cat.news_count}</td>
                <td className='p-3'>
                  <button
                    onClick={() => toggleActive(cat)}
                    className={`rounded px-2 py-0.5 text-xs ${
                      cat.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </button>
                </td>
                <td className='p-3'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(cat)}
                      className='text-blue-600 hover:underline'
                    >
                      এডিট
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
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
