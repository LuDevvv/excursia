'use client'

import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

interface PageLayoutProps {
  children: ReactNode
  hideNavbarOnPaths?: string[]
  hideFooterOnPaths?: string[]
}

/**
 * Layout component that applies consistent page structure
 * Can conditionally hide the navbar and footer on specified paths
 */
export default function PageLayout({
  children,
  hideNavbarOnPaths = [],
  hideFooterOnPaths = [],
}: PageLayoutProps) {
  const pathname = usePathname()

  // Check if navbar should be hidden on the current path
  const shouldHideNavbar = hideNavbarOnPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  )

  // Check if footer should be hidden on the current path
  const shouldHideFooter = hideFooterOnPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  )

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>{children}</main>
      {!shouldHideFooter && <Footer />}
    </>
  )
}
