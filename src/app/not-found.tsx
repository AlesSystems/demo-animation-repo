import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
      <h1 className="text-8xl font-bold text-neutral-700">404</h1>
      <p className="mt-4 text-xl text-neutral-400">Page not found</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-80"
      >
        Back to Home
      </Link>
    </div>
  );
}
