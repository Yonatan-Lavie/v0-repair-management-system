import { redirect } from "next/navigation"
import { getCurrentSession } from "@/app/actions/auth"

export default async function HomePage() {
  const session = await getCurrentSession()

  if (session) {
    switch (session.user.role) {
      case "admin":
        redirect("/admin/dashboard")
      case "shop-manager":
        redirect("/shop/dashboard")
      case "seller":
        redirect("/seller/dashboard")
      case "technician":
        redirect("/technician/dashboard")
      default:
        redirect("/login")
    }
  } else {
    redirect("/login")
  }
}
