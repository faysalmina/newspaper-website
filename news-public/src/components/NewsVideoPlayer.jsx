'use client'

import { useState } from 'react'

export default function NewsVideoPlayer ({ videoUrl, videoType, embedUrl }) {
  // YouTube/Drive লিংক আগে থেকেই জানি এগুলো iframe দিয়ে চলে — শুরুতেই iframe মোডে রাখি
  const [useIframe, setUseIframe] = useState(
    videoType === 'youtube' || videoType === 'drive'
  )

  if (useIframe) {
    return (
      <iframe
        src={embedUrl || videoUrl}
        className='absolute inset-0 h-full w-full'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    )
  }

  // অন্য যেকোনো লিংক — আগে সরাসরি <video> ট্যাগ দিয়ে চালানোর চেষ্টা করি
  // ব্রাউজার এটা প্লে করতে না পারলে (onError) স্বয়ংক্রিয়ভাবে iframe মোডে চলে যাবে
  return (
    <video
      src={videoUrl}
      controls
      className='absolute inset-0 h-full w-full bg-black object-contain'
      onError={() => setUseIframe(true)}
    />
  )
}
