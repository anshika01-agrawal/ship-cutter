import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="card-surface p-8 max-w-lg w-full border border-neutral-700 bg-neutral-950 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-white">Component Render Error</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              An unexpected render issue occurred. The platform has caught the error safely.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-black border border-neutral-800 text-left overflow-x-auto text-[11px] font-mono text-red-300">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleHome}
                className="btn-secondary text-xs px-5 py-2.5 flex items-center gap-1.5 font-mono"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
