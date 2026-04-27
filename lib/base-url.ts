const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const rawBaseUrl = configuredUrl || vercelUrl;

  if (!rawBaseUrl) {
    return 'http://localhost:3000';
  }

  if (/^https?:\/\//i.test(rawBaseUrl)) {
    return trimTrailingSlash(rawBaseUrl);
  }

  return `https://${trimTrailingSlash(rawBaseUrl)}`;
};
