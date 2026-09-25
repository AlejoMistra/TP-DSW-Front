import React, { createContext, useContext, useEffect, useState } from "react"

interface PageHeaderContextType {
  title: React.ReactNode | null
  setTitle: (title: React.ReactNode | null) => void
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined)

export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<React.ReactNode | null>(null)

  return (
    <PageHeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader(): PageHeaderContextType {
  const context = useContext(PageHeaderContext)
  if (!context) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider")
  }
  return context
}

/**
 * Hook to set the page title in the layout header.
 * Cleans up and resets the title when the component unmounts.
 */
export function usePageTitle(pageTitle: React.ReactNode | null) {
  const { setTitle } = usePageHeader()

  useEffect(() => {
    if (pageTitle !== undefined) {
      setTitle(pageTitle)
    }
    return () => {
      setTitle(null)
    }
  }, [pageTitle, setTitle])
}
