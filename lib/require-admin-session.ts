import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_SESSION_COOKIE, getAdminLoginPath, isAdminSessionTokenValid } from './admin-auth';

export const requireAdminSession = async (nextPath: string) => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!isAdminSessionTokenValid(token)) {
    redirect(`${getAdminLoginPath()}?next=${encodeURIComponent(nextPath)}`);
  }
};
