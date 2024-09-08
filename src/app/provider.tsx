import { ReactNode, Suspense } from 'react'
import { PrefectureContextProvider } from '@/context/prefecture'
import ErrorBoundary from './error-boundary'
import { AppLayout } from '@/components/layout'

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <AppLayout>
        <ErrorBoundary>
          <PrefectureContextProvider>{children}</PrefectureContextProvider>
        </ErrorBoundary>
      </AppLayout>
    </Suspense>
  )
}
