import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

interface Props {
  children?: ReactNode
}

interface State {
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.error) {
      return <ErrorDialog />
    }

    return this.props.children
  }
}

function ErrorDialog() {
  return (
    <Dialog
      title="エラー"
      action={<Button onClick={() => window.location.reload()}>再読み込み</Button>}
    >
      エラーが発生しました。再読み込みを行なってください。
    </Dialog>
  )
}

export default ErrorBoundary
