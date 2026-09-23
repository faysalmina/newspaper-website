import { useEffect, useState } from 'react'
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin
} from '../../api/admin'
import { resetAdminPassword } from '../../api/auth'

export default function AdminManagement () {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [resetResult, setResetResult] = useState(null) // { adminName, password }

  const load = () => {
    setLoading(true)
    getAdmins()
      .then(res => setAdmins(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', phone: '' })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = admin => {
    setForm({
      name: admin.name,
      email: admin.email,
      password: '',
      phone: admin.phone || ''
    })
    setEditingId(admin.id)
    setShowForm(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateAdmin(editingId, payload)
      } else {
        await createAdmin(form)
      }
      resetForm()
      load()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'সমস্যা হয়েছে।'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async admin => {
    const action = admin.status === 'active' ? 'ব্যান' : 'সক্রিয়'
    if (!window.confirm(`"${admin.name}" কে ${action} করবেন?`)) return
    await toggleAdminStatus(admin.id)
    load()
  }

  const handleDelete = async admin => {
    if (
      !window.confirm(
        `"${admin.name}" কে স্থায়ীভাবে ডিলিট করবেন? এটা ফেরত নেওয়া যাবে না।`
      )
    )
      return
    await deleteAdmin(admin.id)
    load()
  }

  // 🔑 এটাই নতুন — পুরনো পাসওয়ার্ড না জেনেই রিসেট
  const handleResetPassword = async admin => {
    if (
      !window.confirm(
        `"${admin.name}" এর জন্য একটা নতুন র‍্যান্ডম পাসওয়ার্ড জেনারেট করবেন? পুরনো পাসওয়ার্ড আর কাজ করবে না।`
      )
    )
      return
    const res = await resetAdminPassword(admin.id)
    setResetResult({ adminName: admin.name, password: res.data.new_password })
  }

  if (loading) return <p className='text-gray-500'>লোড হচ্ছে...</p>

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>অ্যাডমিন ম্যানেজমেন্ট</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className='rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark'
        >
          + নতুন অ্যাডমিন
        </button>
      </div>

      {/* পাসওয়ার্ড রিসেট রেজাল্ট মোডাল */}
      {resetResult && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
          <div className='w-full max-w-sm rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-2 font-bold text-green-700'>
              ✅ পাসওয়ার্ড রিসেট হয়েছে
            </h3>
            <p className='mb-3 text-sm text-gray-600'>
              <strong>{resetResult.adminName}</strong> এর নতুন পাসওয়ার্ড — এটা
              এখনই কপি করে তাকে নিরাপদে জানান, এটা আর দেখা যাবে না:
            </p>
            <div className='mb-4 select-all rounded bg-gray-100 p-3 text-center font-mono text-lg'>
              {resetResult.password}
            </div>
            <button
              onClick={() => setResetResult(null)}
              className='w-full rounded bg-brand py-2 text-white hover:bg-brand-dark'
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='mb-6 space-y-3 rounded bg-white p-6 shadow'
        >
          <h2 className='font-semibold'>
            {editingId ? 'অ্যাডমিন এডিট করুন' : 'নতুন অ্যাডমিন তৈরি করুন'}
          </h2>
          {error && (
            <div className='rounded bg-red-50 px-3 py-2 text-sm text-red-600'>
              {error}
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>নাম *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                ইমেইল *
              </label>
              <input
                type='email'
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>
                পাসওয়ার্ড {editingId ? '(পরিবর্তন না করলে খালি রাখুন)' : '*'}
              </label>
              <input
                type='password'
                required={!editingId}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-700'>ফোন</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className='w-full rounded border border-gray-300 px-3 py-2'
              />
            </div>
          </div>

          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={saving}
              className='rounded bg-brand px-6 py-2 text-white hover:bg-brand-dark disabled:opacity-60'
            >
              {saving ? 'সেভ হচ্ছে...' : editingId ? 'আপডেট করুন' : 'তৈরি করুন'}
            </button>
            <button
              type='button'
              onClick={resetForm}
              className='rounded bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200'
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      <div className='overflow-x-auto rounded bg-white shadow'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='p-3'>নাম</th>
              <th className='p-3'>ইমেইল</th>
              <th className='p-3'>ফোন</th>
              <th className='p-3'>নিউজ সংখ্যা</th>
              <th className='p-3'>স্ট্যাটাস</th>
              <th className='p-3'>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 && (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-400'>
                  কোনো Admin নেই
                </td>
              </tr>
            )}
            {admins.map(admin => (
              <tr key={admin.id} className='border-b last:border-0'>
                <td className='p-3'>{admin.name}</td>
                <td className='p-3'>{admin.email}</td>
                <td className='p-3'>{admin.phone || '-'}</td>
                <td className='p-3'>{admin.news_count}</td>
                <td className='p-3'>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {admin.status === 'active' ? 'সক্রিয়' : 'ব্যান করা'}
                  </span>
                </td>
                <td className='p-3'>
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => handleEdit(admin)}
                      className='text-blue-600 hover:underline'
                    >
                      এডিট
                    </button>
                    <button
                      onClick={() => handleResetPassword(admin)}
                      className='text-purple-600 hover:underline'
                    >
                      পাসওয়ার্ড রিসেট
                    </button>
                    <button
                      onClick={() => handleToggle(admin)}
                      className={
                        admin.status === 'active'
                          ? 'text-red-600 hover:underline'
                          : 'text-green-600 hover:underline'
                      }
                    >
                      {admin.status === 'active'
                        ? 'ব্যান করুন'
                        : 'সক্রিয় করুন'}
                    </button>
                    <button
                      onClick={() => handleDelete(admin)}
                      className='text-gray-500 hover:underline'
                    >
                      ডিলিট
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
