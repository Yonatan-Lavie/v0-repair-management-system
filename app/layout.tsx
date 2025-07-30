import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider" // Assuming this exists
import { Toaster } from "@/components/ui/toaster" // Assuming this exists

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "מערכת ניהול תיקוני תכשיטים - QR כפול",
  description: "מערכת ניהול ומעקב תיקוני תכשיטים עם אימות QR כפול",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
