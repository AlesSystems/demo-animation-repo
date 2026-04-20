export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 p-6">
        <p className="text-sm font-medium text-neutral-400">Portal</p>
      </aside>
      <main className="flex-1 p-8 text-white">{children}</main>
    </div>
  );
}
