"use client";

import { Component, type ReactNode } from "react";
import { reportError } from "@/lib/error-log";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    reportError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center"
            style={{ background: "var(--evven-card-background)" }}
          >
            <p
              className="mb-2 text-sm font-medium uppercase tracking-widest"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Something went wrong
            </p>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--evven-text-muted)" }}
            >
              An unexpected error occurred. Please try again.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="rounded-2xl px-6 py-3 text-sm font-semibold text-[var(--evven-text-inverse)] transition-opacity hover:opacity-90"
              style={{ background: "var(--evven-accent-primary)" }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
