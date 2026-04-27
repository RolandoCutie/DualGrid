import Link from 'next/link';

interface AdminBackButtonProps {
  href: string;
  label?: string;
}

export default function AdminBackButton({ href, label = 'Back' }: AdminBackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </Link>
  );
}
