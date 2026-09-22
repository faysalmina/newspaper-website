import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout () {
  const { user, logout, isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItem = (to, label) => (
    <Link
      to={to}
      className={`block rounded px-4 py-2 text-sm ${
        location.pathname === to
          ? 'bg-brand text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className='flex min-h-screen'>
      <aside className='w-64 shrink-0 border-r bg-white p-4'>
        <h2 className='mb-6 text-lg font-bold text-brand'>Daily News BD</h2>

        <nav className='space-y-1'>
          {menuItem('/', 'ড্যাশবোর্ড')}
          {menuItem('/news', 'নিউজ ম্যানেজমেন্ট')}

          {isSuperAdmin && (
            <>
              <p className='mt-4 mb-1 px-4 text-xs font-semibold uppercase text-gray-400'>
                সুপার অ্যাডমিন
              </p>
              {menuItem('/super-admin/admins', 'অ্যাডমিন ম্যানেজমেন্ট')}
              {menuItem('/super-admin/categories', 'ক্যাটাগরি ম্যানেজমেন্ট')}
              {menuItem('/super-admin/activity', 'অ্যাক্টিভিটি লগ')}
              {menuItem('/super-admin/settings', 'সাইট সেটিংস')}
            </>
          )}
        </nav>
      </aside>

      <div className='flex-1'>
        <header className='flex items-center justify-between border-b bg-white px-6 py-3'>
          <span className='text-sm text-gray-500'>
            স্বাগতম, <strong>{user?.name}</strong> (
            {user?.role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'অ্যাডমিন'})
          </span>
          <button
            onClick={handleLogout}
            className='rounded bg-gray-100 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-200'
          >
            লগআউট
          </button>
        </header>

        <main className='p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
