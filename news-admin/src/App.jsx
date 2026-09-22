import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/Layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewsList from './pages/NewsList'
import NewsForm from './pages/NewsForm'
import AdminManagement from './pages/super-admin/AdminManagement'
import ActivityLog from './pages/super-admin/ActivityLog'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/news' element={<NewsList />} />
              <Route path='/news/create' element={<NewsForm />} />
              <Route path='/news/:id/edit' element={<NewsForm />} />

              <Route element={<ProtectedRoute requireSuperAdmin />}>
                <Route
                  path='/super-admin/admins'
                  element={<AdminManagement />}
                />
                <Route path='/super-admin/activity' element={<ActivityLog />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
