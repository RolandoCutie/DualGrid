import AdminGlobalSearchBar from '@/components/admin/AdminGlobalSearchBar';
import Link from 'next/link';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  /** Alternate prop to pass action as object */
  action?: { label: string; href: string };
}

export default function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  action,
}: AdminPageHeaderProps) {
  const href = action?.href || actionHref;
  const label = action?.label || actionLabel;

  return (
    <div className="mb-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-2xl">
          <AdminGlobalSearchBar />
        </div>
        {href && label && (
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {label}
          </Link>
        )}
      </div>
    </div>
  );
}
