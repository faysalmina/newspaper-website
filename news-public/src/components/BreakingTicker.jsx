export default function BreakingTicker ({ items = [] }) {
  if (!items.length) return null

  return (
    <div className='flex items-center bg-yellow-50 border-b border-yellow-200'>
      <span className='shrink-0 bg-brand px-4 py-2 text-sm font-bold text-white'>
        ব্রেকিং নিউজ
      </span>
      <div className='flex-1 overflow-hidden'>
        <div className='animate-marquee whitespace-nowrap py-2 text-sm text-gray-800'>
          {items.map((item, i) => (
            <span key={i} className='mx-8'>
              🔴 {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
