import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 text-8xl">🍿</div>
        <h1 className="mb-2 text-6xl font-bold font-heading text-brand-500">404</h1>
        <h2 className="mb-4 text-2xl font-semibold font-heading">Page Not Found</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Oops! Looks like this snack got away. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Go Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
