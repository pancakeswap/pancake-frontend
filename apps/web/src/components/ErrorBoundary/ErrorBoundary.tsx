import { Component, PropsWithChildren, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  PropsWithChildren<{ fallback?: ((error: Error) => ReactNode) | ReactNode }>,
  { error: Error | undefined }
> {
  constructor(props) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      if (typeof this.props.fallback === 'function') return this.props.fallback(this.state.error)
      return this.props.fallback || <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
