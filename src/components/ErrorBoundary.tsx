import React from 'react';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Log error to console for now; could integrate remote logging
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-secondary">Some products failed to render.</p>
        </div>
      );
    }

    return this.props.children as any;
  }
}

export default ErrorBoundary;
