import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../api/dashboard'
import { useAuth } from '../context/AuthContext'

function StatCard ({ label, value }) {
  return (
    <div className='rounded bg-white p-5 shadow'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='mt-1 text-2xl font-bold text-brand'>{value}</p>
    </div>
  )
}

export default function Dashboard () {
  const [stats, setStats] = useState(null)
  const { isSuperAdmin } = useAuth()

  useEffect(() => {
    getDashboardStats().then(res => setStats(res.data))
  }, [])

  if (!stats) return <p className='text-gray-500'>লোড হচ্ছে...</p>

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>ড্যাশবোর্ড</h1>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        <StatCard
          label={isSuperAdmin ? 'সর্বমোট নিউজ (সাইট)' : 'আমার মোট নিউজ'}
          value={stats.total_news}
        />
        <StatCard label='প্রকাশিত' value={stats.published_news} />
        <StatCard label='খসড়া' value={stats.draft_news} />
        <StatCard
          label={isSuperAdmin ? 'সর্বমোট ভিউ' : 'আমার মোট ভিউ'}
          value={stats.total_views}
        />
      </div>

      {isSuperAdmin && (
        <div className='mt-4 grid grid-cols-3 gap-4'>
          <StatCard label='মোট অ্যাডমিন' value={stats.total_admins} />
          <StatCard label='সক্রিয় অ্যাডমিন' value={stats.active_admins} />
          <StatCard label='ব্যান করা অ্যাডমিন' value={stats.banned_admins} />
        </div>
      )}

      <div className='mt-6 rounded bg-white p-5 shadow'>
        <h2 className='mb-3 font-semibold'>সাম্প্রতিক নিউজ</h2>
        {stats.recent_news.length === 0 ? (
          <p className='text-sm text-gray-400'>এখনো কোনো নিউজ নেই।</p>
        ) : (
          <ul className='divide-y'>
            {stats.recent_news.map(n => (
              <li
                key={n.id}
                className='flex items-center justify-between py-2 text-sm'
              >
                <span>{n.title}</span>
                <span className='text-gray-400'>{n.category?.name}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          to='/news'
          className='mt-3 inline-block text-sm text-blue-600 hover:underline'
        >
          সব নিউজ দেখুন →
        </Link>
      </div>
    </div>
  )
}
