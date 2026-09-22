import { useEffect, useState } from 'react'
import { getActivityLogs } from '../../api/admin'

const actionLabels = {
  login: 'লগইন',
  news_created: 'নিউজ তৈরি',
  news_updated: 'নিউজ আপডেট',
  news_deleted: 'নিউজ ডিলিট',
  admin_created: 'অ্যাডমিন তৈরি',
  admin_updated: 'অ্যাডমিন আপডেট',
  admin_banned: 'অ্যাডমিন ব্যান',
  admin_activated: 'অ্যাডমিন সক্রিয়',
  admin_deleted: 'অ্যাডমিন ডিলিট'
}

export default function ActivityLog () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getActivityLogs(page)
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>
  if (!data) return null

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>অ্যাক্টিভিটি লগ</h1>

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>কে করেছেন</th>
              <th className='p-3'>অ্যাকশন</th>
              <th className='p-3'>বিবরণ</th>
              <th className='p-3'>সময়</th>
              <th className='p-3'>IP</th>
            </tr>
          </thead>
          <tbody>
            {data.data.length === 0 && (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  কোনো লগ নেই
                </td>
              </tr>
            )}
            {data.data.map(log => (
              <tr key={log.id} className='border-b last:border-0'>
                <td className='p-3'>{log.user?.name || '—'}</td>
                <td className='p-3'>
                  <span className='rounded bg-gray-100 px-2 py-0.5 text-xs'>
                    {actionLabels[log.action] || log.action}
                  </span>
                </td>
                <td className='p-3'>{log.description}</td>
                <td className='p-3 text-gray-500'>
                  {new Date(log.created_at).toLocaleString('bn-BD')}
                </td>
                <td className='p-3 text-gray-400'>{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.last_page > 1 && (
        <div className='mt-4 flex justify-center gap-2'>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className='rounded bg-gray-100 px-3 py-1 text-sm disabled:opacity-50'
          >
            আগের
          </button>
          <span className='px-2 text-sm text-gray-600'>
            পৃষ্ঠা {data.current_page} / {data.last_page}
          </span>
          <button
            disabled={page === data.last_page}
            onClick={() => setPage(p => p + 1)}
            className='rounded bg-gray-100 px-3 py-1 text-sm disabled:opacity-50'
          >
            পরের
          </button>
        </div>
      )}
    </div>
  )
}
