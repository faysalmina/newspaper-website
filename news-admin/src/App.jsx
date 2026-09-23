import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/Layout/AdminLayout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import NewsList from './pages/NewsList'
import NewsForm from './pages/NewsForm'
import AdminManagement from './pages/super-admin/AdminManagement'
import ActivityLog from './pages/super-admin/ActivityLog'
import CategoryManagement from './pages/super-admin/CategoryManagement'
import SiteSettings from './pages/super-admin/SiteSettings'
import VideoList from './pages/VideoList'
import VideoForm from './pages/VideoForm'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/news' element={<NewsList />} />
              <Route path='/news/create' element={<NewsForm />} />
              <Route path='/news/:id/edit' element={<NewsForm />} />
              <Route path='/videos' element={<VideoList />} />
              <Route path='/videos/create' element={<VideoForm />} />
              <Route path='/videos/:id/edit' element={<VideoForm />} />

              <Route element={<ProtectedRoute requireSuperAdmin />}>
                <Route
                  path='/super-admin/admins'
                  element={<AdminManagement />}
                />
                <Route path='/super-admin/activity' element={<ActivityLog />} />
                <Route
                  path='/super-admin/categories'
                  element={<CategoryManagement />}
                />
                <Route
                  path='/super-admin/settings'
                  element={<SiteSettings />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
