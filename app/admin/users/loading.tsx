import { Loader2 } from "lucide-react"

export default function UsersLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="sr-only">טוען משתמשים...</span>
    </div>
  )
}
