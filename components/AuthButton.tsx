'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthButton({ session }: { session: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (session) {
    return (
      <button 
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all"
      >
        Esci
      </button>
    )
  }

  return (
    <Link 
      href="/login" 
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
    >
      Accedi
    </Link>
  )
}