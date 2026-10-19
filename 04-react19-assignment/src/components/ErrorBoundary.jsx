import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  returnUI() {
    return (
      <div className="error-fallback">
        <h3>Oops! Something went wrong while loading products.</h3>
        <p>{this.state.error?.message || "An unexpected error occurred."}</p>
        <button className="btn-secondary" onClick={this.handleRetry}>
          Try Again
        </button>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.returnUI();
    }
    return this.props.children;
  }
}
