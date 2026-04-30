'use client'

import dynamic from 'next/dynamic'

const StudioClient = dynamic(
  () => import('../../../components/studio/StudioClient'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sm tracking-[0.28em] uppercase text-zinc-400">
          Loading Studio...
        </div>
      </div>
    ),
  }
)

export default function StudioPage() {
  return <StudioClient />
}