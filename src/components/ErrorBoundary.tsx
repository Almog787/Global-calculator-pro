import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full p-8 my-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-rose-800 mb-2">אירעה שגיאה בטעינת המחשבון / Error loading calculator</h2>
          <p className="text-sm text-rose-600 mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors font-medium text-sm shadow-sm"
          >
            רענן עמוד / Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
