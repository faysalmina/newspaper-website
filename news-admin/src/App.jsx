import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/Layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewsList from './pages/NewsList'
import NewsForm from './pages/NewsForm'

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
                {/* Phase 5: /super-admin/* routes */}
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
