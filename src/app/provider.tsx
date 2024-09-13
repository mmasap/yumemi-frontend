import { ReactNode, Suspense, useState } from 'react'
import ErrorBoundary from './error-boundary'
import { AppLayout } from '@/components/layout/app'
import { Center } from '@/components/layout/common'
import { Spinner } from '@/components/ui/spinner'
import { PrefectureContextProvider } from '@/context/prefecture'
import { useTimeout } from '@/hooks'

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <AppLayout>
        <ErrorBoundary>
          <PrefectureContextProvider>{children}</PrefectureContextProvider>
        </ErrorBoundary>
      </AppLayout>
    </Suspense>
  )
}

const Loading = () => {
  const [show, setShow] = useState(false)
  useTimeout(() => setShow(true), 200)

  if (!show) return null

  return (
    <Center>
      <Spinner size="4rem" aria-label="loading" />
    </Center>
  )
}
