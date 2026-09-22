import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute ({ requireSuperAdmin = false }) {
  const { user, loading, isSuperAdmin } = useAuth()

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center text-gray-500'>
        লোড হচ্ছে...
      </div>
    )
  }

  if (!user) return <Navigate to='/login' replace />
  if (requireSuperAdmin && !isSuperAdmin) return <Navigate to='/' replace />

  return <Outlet />
}
