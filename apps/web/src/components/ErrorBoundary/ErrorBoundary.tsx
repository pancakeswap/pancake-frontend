import { Component, PropsWithChildren, ReactNode } from 'react'

export class ErrorBoundary extends Component<PropsWithChildren<{ fallback?: ReactNode }>, { hasError: boolean }> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
