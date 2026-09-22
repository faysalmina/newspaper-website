export default function ShareButtons ({ url, title }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    },
    {
      name: 'Twitter/X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    }
  ]

  return (
    <div className='flex flex-wrap gap-2'>
      {links.map(l => (
        <a
          key={l.name}
          href={l.href}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50'
        >
          {l.name}
        </a>
      ))}
    </div>
  )
}
