import AdminLoginForm from '@/components/admin/AdminLoginForm';
import {
  ADMIN_SESSION_COOKIE,
  getAdminSecretPath,
  isAdminSessionTokenValid,
  sanitizeNextPath,
} from '@/lib/admin-auth';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ secret: string }>;
  searchParams: Promise<{ next?: string }>;
};

const AdminSecretLoginPage = async ({ params, searchParams }: PageProps) => {
  const { secret } = await params;
  const { next } = await searchParams;

  if (secret !== getAdminSecretPath()) {
    notFound();
  }

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (isAdminSessionTokenValid(token)) {
    redirect('    http://localhost:3000/admin/dashboard/cars/new');
  }

  const nextPath = sanitizeNextPath(next);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground mt-2">
            Sign in with your admin credentials to manage the fleet.
          </p>
        </div>
        <AdminLoginForm nextPath={nextPath} />
      </div>
    </div>
  );
};

export default AdminSecretLoginPage;
