import Link from 'next/link';

const navLinks = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Company info */}
          <div>
            <p className="text-lg font-bold text-white">Ales</p>
            <p className="mt-2 text-sm">Enterprise Hardware Solutions</p>
            <p className="mt-1 text-xs text-neutral-600">
              {/* TRNC business registration placeholder */}
              TRNC Reg. No: — | Lefkoşa, KKTC
            </p>
            <p className="mt-3 text-xs text-neutral-600">
              {/* TRNC VAT requirement */}
              Fiyatlara KDV Dahil / KDV Hariç olabilir.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Navigation</p>
            <ul className="space-y-2">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Get in Touch</p>
            <Link
              href="/quote"
              className="inline-block rounded-md border border-neutral-700 px-4 py-2 text-sm transition-colors hover:border-white hover:text-white"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-xs text-neutral-600">
          © {currentYear} Ales — Enterprise Hardware Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
