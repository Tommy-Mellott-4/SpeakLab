import { Outlet } from 'react-router-dom'
import NavBar from '@/components/NavBar'

export default function Layout() {
  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      <NavBar />
      {/* pt-14 offsets the fixed NavBar height */}
      <main className="flex-1 pt-14 px-6 py-8 w-full max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
