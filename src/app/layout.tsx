import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/layout/Sidebar'
import SessionProviderWrapper from '@/components/auth/SessionProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Study Scheduler',
  description: 'A study scheduler application for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen`}>
        <SessionProviderWrapper>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-0 lg:ml-72">
              <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
