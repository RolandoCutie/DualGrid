import AdminExitButton from '@/components/admin/AdminExitButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-[72px]">
      <AdminExitButton />
      {children}
    </div>
  );
}
