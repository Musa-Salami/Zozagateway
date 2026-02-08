"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 text-8xl">😵</div>
        <h1 className="mb-2 text-4xl font-bold font-heading">Something Went Wrong</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          We apologize for the inconvenience. An unexpected error occurred while
          processing your request.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
