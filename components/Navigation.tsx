'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navigation = () => {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { path: '/', label: '🏠 Inicio' },
    { path: '/add-word', label: '➕ Agregar' },
    { path: '/study', label: '📚 Estudiar' },
    { path: '/words', label: '📋 Mis palabras' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-white/10 shadow-2xl">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(item => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex-1 py-5 px-1 text-center text-sm font-semibold transition-colors ${
              isActive(item.path)
                ? 'text-blue-400 border-t-2 border-blue-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
