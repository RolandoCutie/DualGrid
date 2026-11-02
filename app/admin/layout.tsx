import AdminExitButton from '@/components/admin/AdminExitButton';
import AdminTableDensityToggle from '@/components/admin/AdminTableDensityToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-[72px] admin-theme relative isolate min-h-screen">
      <AdminExitButton />
      <AdminTableDensityToggle />
      {children}
    </div>
  );
}
