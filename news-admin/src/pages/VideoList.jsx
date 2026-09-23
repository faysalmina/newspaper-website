import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getVideos, deleteVideo } from '../api/video'

export default function VideoList () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getVideos()
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async item => {
    if (!window.confirm(`"${item.title}" ভিডিওটি ডিলিট করবেন?`)) return
    await deleteVideo(item.id)
    load()
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>
  if (!data) return null

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>ভিডিও ম্যানেজমেন্ট</h1>
        <Link
          to='/videos/create'
          className='rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark'
        >
          + নতুন ভিডিও
        </Link>
      </div>

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>শিরোনাম</th>
              <th className='p-3'>টাইপ</th>
              <th className='p-3'>লেখক</th>
              <th className='p-3'>স্ট্যাটাস</th>
              <th className='p-3'>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {data.data.length === 0 && (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  কোনো ভিডিও নেই
                </td>
              </tr>
            )}
            {data.data.map(item => (
              <tr key={item.id} className='border-b last:border-0'>
                <td className='p-3'>{item.title}</td>
                <td className='p-3'>
                  {item.video_type === 'youtube' ? 'YouTube' : 'আপলোড'}
                </td>
                <td className='p-3'>{item.author?.name}</td>
                <td className='p-3'>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                  </span>
                </td>
                <td className='p-3'>
                  {item.can_edit ? (
                    <div className='flex gap-2'>
                      <Link
                        to={`/videos/${item.id}/edit`}
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
