import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNews, deleteNews } from '../api/news'
import { useAuth } from '../context/AuthContext'

export default function NewsList () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isSuperAdmin } = useAuth()

  const load = () => {
    setLoading(true)
    setError('')
    getNews()
      .then(res => setData(res.data))
      .catch(() =>
        setError('নিউজ লোড করতে সমস্যা হয়েছে। সার্ভার/কনসোল চেক করুন।')
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async item => {
    if (!window.confirm(`"${item.title}" নিউজটি ডিলিট করবেন?`)) return
    await deleteNews(item.id)
    load()
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>
  if (error) return <p className='text-red-600'>{error}</p>
  if (!data) return null

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>নিউজ ম্যানেজমেন্ট</h1>
        <Link
          to='/news/create'
          className='rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark'
        >
          + নতুন নিউজ
        </Link>
      </div>

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>শিরোনাম</th>
              <th className='p-3'>ক্যাটাগরি</th>
              <th className='p-3'>লেখক</th>
              <th className='p-3'>স্ট্যাটাস</th>
              <th className='p-3'>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map(item => (
              <tr key={item.id} className='border-b last:border-0'>
                <td className='p-3'>{item.title}</td>
                <td className='p-3'>{item.category?.name}</td>
                <td className='p-3'>{item.author?.name}</td>
                <td className='p-3'>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status === 'published'
                      ? 'প্রকাশিত'
                      : item.status === 'draft'
                      ? 'খসড়া'
                      : 'শিডিউলড'}
                  </span>
                </td>
                <td className='p-3'>
                  {item.can_edit ? (
                    <div className='flex gap-2'>
                      <Link
                        to={`/news/${item.id}/edit`}
                        className='text-blue-600 hover:underline'
                      >
                        এডিট
                      </Link>
                      <button
                        onClick={() => handleDelete(item)}
                        className='text-red-600 hover:underline'
                      >
                        ডিলিট
                      </button>
                    </div>
                  ) : (
                    <span className='text-xs text-gray-400'>অনুমতি নেই</span>
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
