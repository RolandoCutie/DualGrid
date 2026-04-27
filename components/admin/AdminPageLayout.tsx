import { ReactNode } from 'react';

interface AdminPageLayoutProps {
  children: ReactNode;
  maxWidth?: '3xl' | '7xl' | '5xl';
}

export default function AdminPageLayout({ children, maxWidth = '7xl' }: AdminPageLayoutProps) {
  const maxWidthClass = maxWidth === '3xl' ? 'max-w-3xl' : maxWidth === '5xl' ? 'max-w-5xl' : 'max-w-7xl';

  return (
    <div className="min-h-screen bg-background">
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-10`}>{children}</div>
    </div>
  );
}
