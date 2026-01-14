// mobile-navigation.tsx
import * as React from "react"
import {  useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export type NavItem = {
  id: string
  name: string
  icon: React.ReactNode
  subLinks: Array<{
    id: string
    name: string
    path: string
    icon?: React.ReactNode
  }>
}

interface MobileNavigationProps {
  navItems: NavItem[]
  className?: string
}

export function MobileNavigation({ navItems, className }: MobileNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = React.useState<NavItem | null>(null)
  const [activeSubLink, setActiveSubLink] = React.useState<string>("")

  // Set initial active nav based on current path
  React.useEffect(() => {
    // Find if current path matches any sublink
    for (const nav of navItems) {
      const matchingSubLink = nav.subLinks.find(sub => 
        location.pathname === sub.path || location.pathname.startsWith(sub.path + "/")
      )
      if (matchingSubLink) {
        setActiveNav(nav)
        setActiveSubLink(matchingSubLink.id)
        break
      }
    }
    
    // If no match found and no active nav, set first nav as active
    if (!activeNav && navItems.length > 0) {
      setActiveNav(navItems[0])
      if (navItems[0].subLinks.length > 0) {
        setActiveSubLink(navItems[0].subLinks[0].id)
        // Navigate to first sublink
        navigate(navItems[0].subLinks[0].path)
      }
    }
  }, [location.pathname, navItems])

  // Handle main nav click
  const handleNavClick = (nav: NavItem) => {
    setActiveNav(nav)
    if (nav.subLinks.length > 0) {
      const firstSubLink = nav.subLinks[0]
      setActiveSubLink(firstSubLink.id)
      navigate(firstSubLink.path)
    }
  }

  // Handle sub nav click
  const handleSubLinkClick = (subLinkId: string, path: string) => {
    setActiveSubLink(subLinkId)
    navigate(path)
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Top Fixed Sub Navigation */}
      {activeNav && activeNav.subLinks.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
          <ScrollArea className="w-full">
            <div className="flex items-center p-2 space-x-1">
              {activeNav.subLinks.map((subLink) => (
                <Button
                  key={subLink.id}
                  variant={activeSubLink === subLink.id ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "shrink-0 whitespace-nowrap",
                    activeSubLink === subLink.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleSubLinkClick(subLink.id, subLink.path)}
                >
                  {subLink.icon && <span className="mr-2">{subLink.icon}</span>}
                  {subLink.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Content - with padding for fixed headers */}
      <div className={cn(
        "flex-1 overflow-auto",
        activeNav?.subLinks.length && activeNav?.subLinks?.length > 0 ? "pt-16" : "pt-0"
      )}>
        {/* Your page content goes here */}
        <div className="p-4">
          {React.Children.toArray(className?.includes("children") ? [] : [])}
        </div>
      </div>

      {/* Bottom Fixed Main Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex items-center justify-around p-2">
          {navItems.map((nav) => (
            <Button
              key={nav.id}
              variant={activeNav?.id === nav.id ? "default" : "ghost"}
              size="lg"
              className={cn(
                "flex flex-col h-16 w-full max-w-20",
                activeNav?.id === nav.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleNavClick(nav)}
            >
              <div className="mb-1">{nav.icon}</div>
              <span className="text-xs truncate">{nav.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Alternative version with icons only
export function MobileNavigationCompact({ navItems, className }: MobileNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = React.useState<NavItem | null>(null)
  const [activeSubLink, setActiveSubLink] = React.useState<string>("")

  React.useEffect(() => {
    for (const nav of navItems) {
      const matchingSubLink = nav.subLinks.find(sub => 
        location.pathname === sub.path || location.pathname.startsWith(sub.path + "/")
      )
      if (matchingSubLink) {
        setActiveNav(nav)
        setActiveSubLink(matchingSubLink.id)
        break
      }
    }
    
    if (!activeNav && navItems.length > 0) {
      setActiveNav(navItems[0])
      if (navItems[0].subLinks.length > 0) {
        setActiveSubLink(navItems[0].subLinks[0].id)
        navigate(navItems[0].subLinks[0].path)
      }
    }
  }, [location.pathname, navItems])

  const handleNavClick = (nav: NavItem) => {
    setActiveNav(nav)
    if (nav.subLinks.length > 0) {
      const firstSubLink = nav.subLinks[0]
      setActiveSubLink(firstSubLink.id)
      navigate(firstSubLink.path)
    }
  }

  const handleSubLinkClick = (subLinkId: string, path: string) => {
    setActiveSubLink(subLinkId)
    navigate(path)
  }

  return (
    <div className={cn("flex flex-col h-screen", className)}>
      {/* Top Sub Navigation */}
      {activeNav && activeNav.subLinks.length > 0 && (
        <div className="sticky top-0 z-40 bg-background border-b">
          <div className="flex overflow-x-auto px-2 py-2 scrollbar-hide">
            {activeNav.subLinks.map((subLink) => (
              <button
                key={subLink.id}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg mx-1 shrink-0 transition-colors",
                  activeSubLink === subLink.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
                onClick={() => handleSubLinkClick(subLink.id, subLink.path)}
              >
                {subLink.icon && <span className="mr-2">{subLink.icon}</span>}
                <span className="text-sm font-medium">{subLink.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto",
        activeNav?.subLinks.length && activeNav?.subLinks?.length > 0 ? "pt-16" : "pt-0"
      )}>
        {/* Page content will be rendered here */}
        {React.Children.toArray(className?.includes("children") ? [] : [])}
      </main>

      {/* Bottom Main Navigation */}
      <nav className="sticky bottom-0 z-40 bg-background border-t">
        <div className="flex items-center justify-between px-2 py-1">
          {navItems.map((nav) => (
            <button
              key={nav.id}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg flex-1 mx-1 transition-colors",
                activeNav?.id === nav.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
              onClick={() => handleNavClick(nav)}
            >
              <div className="mb-1">{nav.icon}</div>
              <span className="text-xs">{nav.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

// Usage wrapper component
interface MobileNavigationProviderProps {
  children?: React.ReactNode
  navItems: NavItem[]
}

export function MobileNavigationProvider({ children, navItems }: MobileNavigationProviderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = React.useState<NavItem | null>(null)
  const [activeSubLink, setActiveSubLink] = React.useState<string>("")

  React.useEffect(() => {
    for (const nav of navItems) {
      const matchingSubLink = nav.subLinks.find(sub => 
        location.pathname === sub.path || location.pathname.startsWith(sub.path + "/")
      )
      if (matchingSubLink) {
        setActiveNav(nav)
        setActiveSubLink(matchingSubLink.id)
        break
      }
    }
    
    if (!activeNav && navItems.length > 0) {
      setActiveNav(navItems[0])
      if (navItems[0].subLinks.length > 0) {
        setActiveSubLink(navItems[0].subLinks[0].id)
        navigate(navItems[0].subLinks[0].path)
      }
    }
  }, [location.pathname, navItems])

  const handleNavClick = (nav: NavItem) => {
    setActiveNav(nav)
    if (nav.subLinks.length > 0) {
      const firstSubLink = nav.subLinks[0]
      setActiveSubLink(firstSubLink.id)
      navigate(firstSubLink.path)
    }
  }

  const handleSubLinkClick = (subLinkId: string, path: string) => {
    setActiveSubLink(subLinkId)
    navigate(path)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Sub Navigation */}
      {activeNav && activeNav.subLinks.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
          <div className="flex overflow-x-auto px-3 py-2">
            {activeNav.subLinks.map((subLink) => (
              <button
                key={subLink.id}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg mx-1 shrink-0 transition-all",
                  activeSubLink === subLink.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "hover:bg-accent"
                )}
                onClick={() => handleSubLinkClick(subLink.id, subLink.path)}
              >
                {subLink.icon && <span className="mr-2">{subLink.icon}</span>}
                <span className="text-sm font-medium whitespace-nowrap">
                  {subLink.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content with padding */}
      <div className={cn(
        "flex-1 overflow-y-auto",
        activeNav?.subLinks?.length && activeNav?.subLinks?.length > 0 ? "pt-16 pb-20" : "pb-20"
      )}>
        {children}
      </div>

      {/* Bottom Main Navigation */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-background border-t shadow-lg">
                  <ScrollArea>
              
              <div className="flex items-center justify-around p-2">
          {navItems.map((nav) => (
            <button
              key={nav.id}
              className={cn(
                "flex flex-col min-w-[100px] py-2 items-center justify-center  rounded-xl flex-1 mx-1 transition-all",
                activeNav?.id === nav.id
                  ? "bg-gradient-primary py-0  text-primary-foreground transform scale-105"
                  : "hover:bg-accent  "
              )}
              onClick={() => handleNavClick(nav)}
            >
              <div className={cn(
                "mb-1 transition-transform",
                activeNav?.id === nav.id && "scale-110 p-0"
              )}>
                {nav.icon}
              </div>
              {activeNav?.id == nav.id && (
                <span className="text-xs font-medium truncate w-full text-center block whitespace-nowrap overflow-hidden">
                  {nav.name}
                </span>
              )}
            </button>
          ))}
                      
              </div>
              <ScrollBar orientation='horizontal'/>
                      </ScrollArea>
      </div>
    </div>
  )
}