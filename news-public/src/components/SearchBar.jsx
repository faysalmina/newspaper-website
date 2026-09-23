'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar ({ mobile = false }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = e => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={mobile ? 'w-full' : 'hidden md:flex'}
    >
      <div className='flex w-64 overflow-hidden rounded-md border-2 border-gray-300 bg-white focus-within:border-brand'>
        <input
          type='text'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='সংবাদ খুঁজুন...'
          className='w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none'
        />
        <button
          type='submit'
          aria-label='সার্চ করুন'
          className='flex items-center justify-center bg-brand px-4 text-white transition hover:bg-brand-dark'
        >
          🔍
        </button>
      </div>
    </form>
  )
}
