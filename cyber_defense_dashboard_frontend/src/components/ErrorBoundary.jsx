import React from 'react'

/**
 * ErrorBoundary catches runtime errors in its child component tree and renders a fallback UI.
 * It prevents the app from showing a blank screen when unexpected exceptions occur.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log to console for diagnostics; in future, send to monitoring
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Something went wrong</h2>
            </div>
            <div className="card-content">
              <p className="text-sm text-red-600 dark:text-red-400">
                An unexpected error occurred while rendering the application.
              </p>
              {this.state.error && (
                <pre className="mt-3 text-xs overflow-auto p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  {String(this.state.error?.message || this.state.error)}
                </pre>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Try refreshing the page. If the problem persists, please report this issue.
              </p>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
