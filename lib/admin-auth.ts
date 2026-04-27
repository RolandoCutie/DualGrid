import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const ADMIN_SESSION_MAX_AGE_MS = ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
const DEFAULT_ADMIN_SECRET_PATH = 'rentacar-admin-access';

const getAdminUsername = () => process.env.ADMIN_USERNAME?.trim() ?? 'admin';
const getAdminPassword = () => process.env.ADMIN_PASSWORD?.trim() ?? 'admin123';
const getSessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET?.trim() ?? 'dev-admin-session-secret';

const createSignature = (payload: string) =>
  createHmac('sha256', getSessionSecret()).update(payload).digest('hex');

const safeCompare = (value: string, expected: string) => {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
};

export const getAdminSecretPath = () => {
  const configuredPath = process.env.ADMIN_SECRET_PATH?.trim();
  if (!configuredPath) {
    return DEFAULT_ADMIN_SECRET_PATH;
  }

  return configuredPath.replace(/\//g, '') || DEFAULT_ADMIN_SECRET_PATH;
};

export const getAdminLoginPath = () => `/admin/${getAdminSecretPath()}`;

export const getAdminSessionMaxAge = () => ADMIN_SESSION_MAX_AGE_SECONDS;

export const areAdminCredentialsValid = (username: string, password: string) => {
  return safeCompare(username, getAdminUsername()) && safeCompare(password, getAdminPassword());
};

export const createAdminSessionToken = (username: string) => {
  const timestamp = Date.now().toString();
  const payload = `${username}:${timestamp}`;
  const signature = createSignature(payload);

  return Buffer.from(`${payload}:${signature}`).toString('base64url');
};

export const isAdminSessionTokenValid = (token?: string) => {
  if (!token) {
    return false;
  }

  let decoded = '';

  try {
    decoded = Buffer.from(token, 'base64url').toString('utf-8');
  } catch {
    return false;
  }

  const [username, timestamp, signature] = decoded.split(':');
  if (!username || !timestamp || !signature) {
    return false;
  }

  if (!safeCompare(username, getAdminUsername())) {
    return false;
  }

  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  if (Date.now() - issuedAt > ADMIN_SESSION_MAX_AGE_MS) {
    return false;
  }

  const payload = `${username}:${timestamp}`;
  const expectedSignature = createSignature(payload);

  return safeCompare(signature, expectedSignature);
};

export const sanitizeNextPath = (nextPath?: string) => {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/admin/dashboard';
  }

  return nextPath;
};
