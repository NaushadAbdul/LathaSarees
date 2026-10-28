import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LotusOrnament } from './Navbar';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F0E6] text-[#33221C] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-8 sm:p-10 text-center shadow-lg space-y-6">
            <div className="flex justify-center text-[#B99A62]">
              <LotusOrnament className="w-10 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] tracking-[0.2em] font-medium text-[#5A2630] uppercase">
                Latha Sarees & Jewelry
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#33221C]">
                An Unexpected Interruption Occurred
              </h1>
            </div>
            <p className="text-xs text-[#806B5E] leading-relaxed">
              We encountered a temporary interface synchronization issue. Your session and bag remain completely secure.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.14em] hover:bg-[#5A2630] transition-colors"
              >
                RELOAD INTERFACE
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 border border-[#4A1C24] text-[#4A1C24] text-xs font-semibold tracking-[0.14em] hover:bg-[#EFE2D1] transition-colors"
              >
                RETURN HOME
              </button>
            </div>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="text-left mt-4 p-3 bg-[#F7F0E6] text-[11px] text-[#5A2630] font-mono overflow-auto max-h-36 border border-[#B99A62]/30">
                <summary className="cursor-pointer font-sans font-semibold">Diagnostic Details</summary>
                <p className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
