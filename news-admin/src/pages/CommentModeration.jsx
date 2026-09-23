import { useEffect, useState } from 'react'
import { getComments, approveComment, deleteComment } from '../api/comment'

export default function CommentModeration () {
  const [comments, setComments] = useState(null)
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getComments(filter)
      .then(res => setComments(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filter])

  const handleApprove = async comment => {
    await approveComment(comment.id)
    load()
  }

  const handleDelete = async comment => {
    if (!window.confirm('এই কমেন্টটি ডিলিট করবেন?')) return
    await deleteComment(comment.id)
    load()
  }

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>কমেন্ট মডারেশন</h1>

      <div className='mb-4 flex gap-2'>
        {['pending', 'approved', ''].map(f => (
          <button
            key={f || 'all'}
            onClick={() => setFilter(f)}
            className={`rounded px-4 py-1.5 text-sm ${
              filter === f ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {f === 'pending'
              ? 'অপেক্ষমাণ'
              : f === 'approved'
              ? 'অনুমোদিত'
              : 'সব'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className='text-gray-500'>লোড হচ্ছে...</p>
      ) : !comments || comments.data.length === 0 ? (
        <p className='text-gray-400'>এখানে কোনো কমেন্ট নেই।</p>
      ) : (
        <div className='space-y-3'>
          {comments.data.map(c => (
            <div key={c.id} className='rounded bg-white p-4 shadow'>
              <div className='mb-2 flex items-start justify-between'>
                <div>
                  <p className='font-semibold'>
                    {c.name}{' '}
                    <span className='ml-2 text-xs text-gray-400'>
                      {c.email}
                    </span>
                  </p>
                  <p className='text-xs text-gray-400'>
                    নিউজ: <span className='text-gray-600'>{c.news?.title}</span>
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    c.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {c.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                </span>
              </div>
              <p className='mb-3 text-sm text-gray-700'>{c.comment}</p>
              <div className='flex gap-3 text-sm'>
                {c.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(c)}
                    className='text-green-600 hover:underline'
                  >
                    অনুমোদন করুন
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c)}
                  className='text-red-600 hover:underline'
                >
                  ডিলিট
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
