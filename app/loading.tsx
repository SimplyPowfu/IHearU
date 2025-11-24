export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-32 px-6">
      
      {/* Hero Skeleton */}
      <div className="w-48 h-8 bg-surface/50 rounded-full animate-pulse mb-8" />
      <div className="w-full max-w-4xl h-24 bg-surface/30 rounded-3xl animate-pulse mb-8" />
      <div className="w-full max-w-2xl h-8 bg-surface/20 rounded-xl animate-pulse mb-10" />
      
      <div className="flex gap-4">
        <div className="w-40 h-14 bg-surface/40 rounded-xl animate-pulse" />
        <div className="w-40 h-14 bg-surface/20 rounded-xl animate-pulse" />
      </div>

      {/* Stats Skeleton */}
      <div className="w-full max-w-7xl mt-32 h-32 bg-surface/10 rounded-2xl animate-pulse" />
    </div>
  )
}