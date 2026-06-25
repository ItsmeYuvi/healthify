"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full text-center space-y-6 bg-red-950/5 border-red-500/20">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-3xl bg-danger/10 border border-danger/20 text-danger mx-auto">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">System Interrupted</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                An unexpected interface render fault occurred. Press try again to rebuild the view.
              </p>
              {this.state.error && (
                <div className="text-left text-[11px] font-mono text-danger/80 bg-red-950/20 border border-red-500/10 p-3 rounded-xl overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <GlassButton variant="primary" className="w-full font-semibold" onClick={this.handleReset}>
              Try Again
            </GlassButton>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
