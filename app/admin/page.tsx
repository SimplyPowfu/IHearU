import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from './Dashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: adminRecord } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!adminRecord) {
    redirect('/')
  }

  const { data: contributions } = await supabase
    .from('contributions')
    .select(`
      id,
      video_url,
      created_at,
      words ( text )
    `)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  const contributionsWithUrls = await Promise.all(
    (contributions || []).map(async (item: any) => {
      const { data } = await supabase
        .storage
        .from('contributi_video')
        .createSignedUrl(item.video_url, 3600)

      return {
        ...item,
        signedUrl: data?.signedUrl,
      }
    })
  )

  return (
    <main className="min-h-screen bg-gray-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
             <h1 className="text-4xl font-bold mb-2 text-white">
              Dashboard Admin 🛡️
            </h1>
            <p className="text-gray-400">
              Accesso autorizzato per: <span className="text-blue-400 font-mono">{user.email}</span>
            </p>
          </div>
        </div>

        <AdminDashboard initialData={contributionsWithUrls} />
      </div>
    </main>
  )
}