export default function Loading () {
  return (
    <div className='container-main py-8'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2 animate-pulse'>
          <div className='aspect-video rounded bg-gray-200' />
          <div className='mt-4 h-6 w-3/4 rounded bg-gray-200' />
          <div className='mt-2 h-4 w-1/2 rounded bg-gray-200' />
        </div>
        <div className='space-y-4 animate-pulse'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='h-16 rounded bg-gray-200' />
          ))}
        </div>
      </div>
    </div>
  )
}
